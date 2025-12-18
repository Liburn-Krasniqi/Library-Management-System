# recommendation_api.py
# Enhanced Flask API - No database dependency

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import faiss
from pymilvus import model
import ast

app = Flask(__name__)
CORS(app)

# Initialize on startup
embedding_fn = model.DefaultEmbeddingFunction()
index = faiss.read_index('index')
df = pd.read_csv('goodreads_data.csv')

def create_textual_representation(row):
    return f"""Book: {row['Book']}
Author: {row['Author']}
Genres: {row['Genres']}
Description: {row['Description']}
"""

df['textual_representation'] = df.apply(create_textual_representation, axis=1)

def format_book_response(book, idx):
    """Format a book record for API response"""
    try:
        genres = book['Genres']
        if pd.notna(genres):
            if isinstance(genres, str):
                try:
                    genres = ast.literal_eval(genres)
                    if not isinstance(genres, list):
                        genres = [str(genres)]
                except:
                    genres = [genres]
            elif isinstance(genres, list):
                genres = genres
            else:
                genres = []
        else:
            genres = []
        
        return {
            'id': int(idx),
            'title': str(book['Book']) if pd.notna(book['Book']) else 'Unknown',
            'author': str(book['Author']) if pd.notna(book['Author']) else 'Unknown',
            'description': str(book['Description']) if pd.notna(book['Description']) else '',
            'genres': genres,
            'avgRating': float(book['Avg_Rating']) if pd.notna(book['Avg_Rating']) else None,
            'numRatings': str(book['Num_Ratings']) if pd.notna(book['Num_Ratings']) else '0',
            'url': str(book['URL']) if pd.notna(book['URL']) else ''
        }
    except Exception as e:
        print(f"Error formatting book at index {idx}: {e}")
        return None

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'books_loaded': len(df)})

@app.route('/popular', methods=['GET'])
def get_popular():
    """Get popular books - useful for new users"""
    try:
        limit = int(request.args.get('limit', 8))
        
        # Sort by number of ratings and average rating
        # First convert Num_Ratings to numeric, handling commas
        df['Num_Ratings_Clean'] = df['Num_Ratings'].apply(
            lambda x: int(str(x).replace(',', '')) if pd.notna(x) and str(x).replace(',', '').isdigit() else 0
        )
        
        popular = df.nlargest(limit * 2, 'Num_Ratings_Clean')
        popular = popular[popular['Avg_Rating'] >= 4.0].head(limit)
        
        recommendations = []
        for idx, book in popular.iterrows():
            formatted = format_book_response(book, idx)
            if formatted:
                recommendations.append(formatted)
        
        return jsonify({
            'recommendations': recommendations,
            'message': 'Popular books you might enjoy'
        })
        
    except Exception as e:
        print(f"Error in /popular: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/recommend/by-title', methods=['POST'])
def recommend_by_title():
    """
    Get recommendations based on a book title
    Expects: {"book_title": "To Kill a Mockingbird", "num_recommendations": 5}
    """
    try:
        data = request.json
        book_title = data.get('book_title', '')
        num_recs = data.get('num_recommendations', 5)
        
        if not book_title:
            return jsonify({'error': 'book_title is required'}), 400
        
        # Find the book
        book_row = df[df['Book'].str.contains(book_title, case=False, na=False)]
        
        if book_row.empty:
            return jsonify({'error': 'Book not found'}), 404
        
        book_row = book_row.iloc[0]
        book_idx = book_row.name
        
        # Get recommendations
        recommendations = get_similar_books(book_idx, num_recs + 1)
        
        # Remove the original book from results
        recommendations = [r for r in recommendations if r['id'] != book_idx][:num_recs]
        
        return jsonify({
            'recommendations': recommendations,
            'message': f'Based on {book_row["Book"]}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommend/by-ids', methods=['POST'])
def recommend_by_ids():
    """
    Get recommendations based on multiple book IDs
    Expects: {"book_ids": [0, 5, 10], "num_recommendations": 8}
    """
    try:
        data = request.json
        book_ids = data.get('book_ids', [])
        num_recs = data.get('num_recommendations', 8)
        
        if not book_ids:
            return get_popular()  # Fallback to popular books
        
        # Get the most recent book ID
        primary_book_id = book_ids[0] if isinstance(book_ids[0], int) else book_ids[0]['id']
        
        if primary_book_id >= len(df):
            return jsonify({'error': 'Invalid book ID'}), 400
        
        # Get recommendations
        recommendations = get_similar_books(primary_book_id, num_recs * 2)
        
        # Filter out books user already has
        book_id_set = set(book_ids if isinstance(book_ids[0], int) else [b['id'] for b in book_ids])
        recommendations = [r for r in recommendations if r['id'] not in book_id_set][:num_recs]
        
        return jsonify({
            'recommendations': recommendations,
            'message': 'Based on your reading history'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommend/by-genres', methods=['POST'])
def recommend_by_genres():
    """
    Get recommendations based on favorite genres
    Expects: {"genres": ["Fiction", "Mystery"], "num_recommendations": 8}
    """
    try:
        data = request.json
        genres = data.get('genres', [])
        num_recs = data.get('num_recommendations', 8)
        
        if not genres:
            return get_popular()
        
        # Filter books by genres
        def has_genre(book_genres):
            if pd.isna(book_genres):
                return False
            try:
                genre_list = ast.literal_eval(book_genres) if isinstance(book_genres, str) else book_genres
                return any(g in genre_list for g in genres)
            except:
                return False
        
        filtered = df[df['Genres'].apply(has_genre)]
        
        if filtered.empty:
            return get_popular()
        
        # Get highest rated books in those genres
        top_books = filtered.nlargest(num_recs, 'Avg_Rating')
        
        recommendations = [
            format_book_response(book, idx)
            for idx, book in top_books.iterrows()
        ]
        
        return jsonify({
            'recommendations': recommendations,
            'message': f'Top books in {", ".join(genres)}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/book/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get details for a specific book"""
    try:
        if book_id >= len(df):
            return jsonify({'error': 'Book not found'}), 404
        
        book = df.iloc[book_id]
        return jsonify(format_book_response(book, book_id))
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/search', methods=['GET'])
def search_books():
    """Search books by title or author"""
    try:
        query = request.args.get('q', '')
        limit = int(request.args.get('limit', 20))
        
        if not query:
            return jsonify({'error': 'Query parameter "q" is required'}), 400
        
        # Search in title and author
        mask = (
            df['Book'].str.contains(query, case=False, na=False) |
            df['Author'].str.contains(query, case=False, na=False)
        )
        
        results = df[mask].head(limit)
        
        books = [
            format_book_response(book, idx)
            for idx, book in results.iterrows()
        ]
        
        return jsonify({
            'books': books,
            'count': len(books)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_similar_books(book_id, num_results):
    """Helper function to get similar books using FAISS"""
    book_row = df.iloc[book_id]
    text_rep = book_row['textual_representation']
    
    # Generate embedding
    query_vectors = embedding_fn.encode_queries([text_rep])
    embedding = np.array(query_vectors, dtype='float32')
    
    # Search FAISS index
    D, I = index.search(embedding, num_results)
    
    # Format results
    recommendations = [
        format_book_response(df.iloc[idx], idx)
        for idx in I.flatten()
    ]
    
    return recommendations

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)