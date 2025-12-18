// recommendations.service.ts (Tailored to your Prisma schema)
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DisplayBook } from 'generated/prisma/client';

@Injectable()
export class RecommendationsService {
  private readonly pythonApiUrl =
    process.env.PYTHON_API_URL || 'http://localhost:5001';

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async getRecommendationsForUser(userId: string, limit: number = 8) {
    try {
      // Get user's reading history from database
      // Books that user has read or is reading
      const userBooks = await this.prisma.book.findMany({
        where: {
          userId,
          // Include completed and currently reading books
          readingStatus: {
            in: ['COMPLETED', 'READING'],
          },
        },
        include: {
          displayBook: true, // Get the full book details
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 20, // Get last 20 books
      });

      // Filter out books that don't have displayBook linked
      const validBooks = userBooks.filter((book) => book.displayBook !== null);

      if (validBooks.length === 0) {
        // If user has no reading history, return popular books
        return this.getPopularBooks(limit);
      }

      // Prepare reading history for Python API
      const readingHistory = validBooks
        .map((book) => ({
          book_id: book.displayBook!.datasetIndex || 0,
          rating: this.inferRatingFromStatus(book.readingStatus),
        }))
        .filter((item) => item.book_id !== 0); // Filter out books without datasetIndex

      if (readingHistory.length === 0) {
        return this.getPopularBooks(limit);
      }

      // Call Python recommendation API
      const response = await firstValueFrom(
        this.httpService.post(`${this.pythonApiUrl}/recommend/user`, {
          reading_history: readingHistory,
          num_recommendations: limit,
        }),
      );

      const pythonRecommendations = response.data.recommendations;

      // Map Python recommendations back to DisplayBooks
      const recommendations = await this.mapRecommendationsToDisplayBooks(
        pythonRecommendations,
        userId,
      );

      return {
        recommendations,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);

      // Fallback to popular books
      return this.getPopularBooks(limit);
    }
  }

  private inferRatingFromStatus(status: string): number {
    // Convert reading status to a rating (1-5)
    switch (status) {
      case 'COMPLETED':
        return 5;
      case 'READING':
        return 4;
      case 'WANT_TO_READ':
        return 3;
      case 'DROPPED':
        return 2;
      default:
        return 3;
    }
  }

  private async mapRecommendationsToDisplayBooks(
    pythonRecommendations: any[],
    userId: string,
  ) {
    const recommendations: DisplayBook[] = [];

    // Get books user already has in their library
    const userBookIds = await this.prisma.book.findMany({
      where: { userId },
      select: { bookId: true },
    });
    const userBookIdSet = new Set(
      userBookIds.map((b) => b.bookId).filter((id) => id !== null),
    );

    for (const rec of pythonRecommendations) {
      // Try to find the book in DisplayBook table
      let displayBook = await this.prisma.displayBook.findUnique({
        where: { datasetIndex: rec.id },
      });

      // If DisplayBook doesn't exist, create it
      if (!displayBook) {
        try {
          displayBook = await this.prisma.displayBook.create({
            data: {
              title: rec.title,
              author: rec.author,
              description: rec.description,
              genres: rec.genres,
              avgRating: rec.avg_rating,
              coverImage: null, // You might want to fetch this later
              datasetIndex: rec.id,
            },
          });
        } catch (error) {
          console.error('Error creating DisplayBook:', error);
          continue;
        }
      }

      // Skip books user already has in their library
      if (!userBookIdSet.has(displayBook.id)) {
        recommendations.push(displayBook); //Argument of type '{ id: number; title: string; author: string; description: string | null; createdAt: Date; updatedAt: Date; genres: string | null; avgRating: number | null; coverImage: string | null; datasetIndex: number | null; }' is not assignable to parameter of type 'never'. ???????
      }
    }

    return recommendations;
  }

  private async getPopularBooks(limit: number = 8) {
    const displayBooks = await this.prisma.displayBook.findMany({
      take: limit,
      orderBy: [{ avgRating: 'desc' }, { createdAt: 'desc' }],
      where: {
        avgRating: {
          not: null,
        },
      },
    });

    return {
      recommendations: displayBooks,
      message: 'Popular books you might enjoy',
    };
  }

  // Helper method to add a book to user's library
  async addBookToUserLibrary(
    userId: string,
    displayBookId: number,
    status:
      | 'READING'
      | 'COMPLETED'
      | 'WANT_TO_READ'
      | 'DROPPED' = 'WANT_TO_READ',
  ) {
    const displayBook = await this.prisma.displayBook.findUnique({
      where: { id: displayBookId },
    });

    if (!displayBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    // Check if user already has this book
    const existingBook = await this.prisma.book.findFirst({
      where: {
        userId,
        bookId: displayBookId,
      },
    });

    if (existingBook) {
      throw new HttpException(
        'Book already in your library',
        HttpStatus.CONFLICT,
      );
    }

    // Create a book entry for the user
    const userBook = await this.prisma.book.create({
      data: {
        title: displayBook.title,
        author: displayBook.author,
        genre: displayBook.genres,
        description: displayBook.description,
        readingStatus: status,
        userId,
        bookId: displayBookId,
      },
      include: {
        displayBook: true,
      },
    });

    return userBook;
  }
}
