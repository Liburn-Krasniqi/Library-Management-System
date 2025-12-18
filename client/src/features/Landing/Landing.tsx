// Landing.tsx - Direct Python API integration
import { Link } from "react-router-dom";
import { BookOpen, Users, TrendingUp, Sparkles, Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface DisplayBook {
  id: number;
  title: string;
  author: string;
  description?: string;
  genres?: string[];
  avgRating?: number;
  numRatings?: string;
  url?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface LandingProps {
  user?: User | null;
}

export function Landing({ user }: LandingProps) {
  const [recommendations, setRecommendations] = useState<DisplayBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const PYTHON_API_URL = "http://localhost:5001";

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  useEffect(() => {
    fetchRecommendations();

    // DEBUG: Check what we're sending to Python API
    fetchUserReadingHistory().then((bookIds) => {
      console.log("User's book IDs:", bookIds);
      if (bookIds.length === 0) {
        console.log("⚠️ No book IDs - showing popular books instead");
      } else {
        console.log("✅ Personalized recommendations based on:", bookIds);
      }
    });
  }, [user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      let response;

      if (user) {
        // For logged-in users, try to get user's reading history from your backend
        // and send it to Python API
        const userBooks = await fetchUserReadingHistory();

        if (userBooks.length > 0) {
          // Get recommendations based on user's books
          response = await fetch(`${PYTHON_API_URL}/recommend/by-ids`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              book_ids: userBooks,
              num_recommendations: 8,
            }),
          });
        } else {
          // New user - get popular books
          response = await fetch(`${PYTHON_API_URL}/popular?limit=8`);
        }
      } else {
        // Non-logged in users get popular books
        response = await fetch(`${PYTHON_API_URL}/popular?limit=8`);
      }

      if (response && response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setMessage(data.message || "Popular books you might enjoy");
      } else {
        console.error("Failed to fetch recommendations:", response?.status);
        setMessage(
          "Unable to load recommendations. Please make sure the Python API is running on port 5001."
        );
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setMessage(
        "Unable to connect to recommendation service. Is the Python API running?"
      );
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReadingHistory = async (): Promise<number[]> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      // Fetch user's books from your NestJS backend
      const response = await fetch("http://localhost:3000/api/books/my-books", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const books = await response.json();
        // Extract datasetIndex from user's books
        // You'll need to store datasetIndex when user adds books
        return books
          .filter((b: any) => b.datasetIndex !== null)
          .map((b: any) => b.datasetIndex);
      }
    } catch (error) {
      console.error("Error fetching reading history:", error);
    }
    return [];
  };

  const getSimilarBooks = async (bookId: number) => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/recommend/by-ids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_ids: [bookId],
          num_recommendations: 8,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error getting similar books:", error);
    }
  };

  if (user) {
    return (
      <div className="landing-page">
        <section className="hero-section text-center mb-5">
          <div className="container">
            <h1 className="display-3 fw-bold color-4 mb-4">
              Welcome back, {user.name}!
            </h1>
            <p
              className="lead fs-4 color-1 mb-4 mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Ready to discover your next great read?
            </p>
          </div>
        </section>

        <section className="recommendations-section py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold color-4 display-5 mb-2">
                  <Sparkles
                    size={32}
                    className="me-2 color-1"
                    style={{ display: "inline" }}
                  />
                  Recommended For You
                </h2>
                <p className="color-1 fs-5">{message}</p>
              </div>
              <Link
                to="/books"
                className="btn background-1 color-white fw-bold"
              >
                Browse All Books
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border color-1" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="row g-4">
                {recommendations.map((book) => (
                  <div key={book.id} className="col-md-6 col-lg-3">
                    <div className="book-card background-2 rounded shadow-bottom h-100 overflow-hidden">
                      <div
                        className="w-100 background-4 d-flex align-items-center justify-content-center"
                        style={{ height: "300px" }}
                      >
                        <BookOpen size={64} className="color-1" />
                      </div>
                      <div className="p-3">
                        <h5 className="fw-bold color-4 mb-2">{book.title}</h5>
                        <p className="color-1 mb-2">by {book.author}</p>
                        {book.avgRating && (
                          <div className="mb-2">
                            <span className="color-1">
                              ⭐ {book.avgRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                        {book.genres && book.genres.length > 0 && (
                          <div className="mb-2">
                            {book.genres.slice(0, 3).map((genre, idx) => (
                              <span
                                key={idx}
                                className="badge me-1 mb-1"
                                style={{
                                  backgroundColor: "#84994f",
                                  color: "white",
                                }}
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                        {book.description && (
                          <p
                            className="color-4 small mb-3"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {book.description}
                          </p>
                        )}
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => getSimilarBooks(book.id)}
                            className="btn btn-sm background-1 color-white flex-grow-1"
                          >
                            More Like This
                          </button>
                          {book.url && (
                            <a
                              href={book.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-secondary"
                              style={{
                                borderColor: "#84994f",
                                color: "#84994f",
                              }}
                            >
                              Details
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 background-2 rounded">
                <BookOpen size={64} className="color-1 mb-3" />
                <h4 className="color-4 mb-3">No recommendations yet</h4>
                <p className="color-1 mb-4">
                  Start exploring books to get personalized recommendations!
                </p>
                <Link
                  to="/books"
                  className="btn background-1 color-white fw-bold"
                >
                  Explore Books
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="quick-stats-section py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-4">
                <Link
                  to="/my-books?status=reading"
                  className="text-decoration-none"
                >
                  <div className="stat-card background-2 p-4 rounded shadow-bottom text-center">
                    <BookOpen size={48} className="color-1 mb-3" />
                    <h4 className="fw-bold color-4">Currently Reading</h4>
                    <p className="color-1">View your progress</p>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link
                  to="/my-books?status=completed"
                  className="text-decoration-none"
                >
                  <div className="stat-card background-2 p-4 rounded shadow-bottom text-center">
                    <TrendingUp size={48} className="color-1 mb-3" />
                    <h4 className="fw-bold color-4">Books Completed</h4>
                    <p className="color-1">See your achievements</p>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link
                  to="/my-books?status=wishlist"
                  className="text-decoration-none"
                >
                  <div className="stat-card background-2 p-4 rounded shadow-bottom text-center">
                    <Heart size={48} className="color-1 mb-3" />
                    <h4 className="fw-bold color-4">Want to Read</h4>
                    <p className="color-1">Your wishlist</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Default landing page for non-logged-in users
  return (
    <div className="landing-page">
      <section className="hero-section text-center mb-5">
        <div className="container">
          <h1 className="display-3 fw-bold color-4 mb-4">
            Welcome to ReadSite
          </h1>
          <p
            className="lead fs-4 color-1 mb-4 mx-auto"
            style={{ maxWidth: "700px" }}
          >
            Your personal library companion. Track your reading journey,
            discover new books, and connect with fellow readers.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link
              to="/register"
              className="btn btn-lg background-1 color-white px-5 py-3 fw-bold shadow-bottom"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="btn btn-lg btn-outline-secondary px-5 py-3 fw-bold"
              style={{
                borderColor: "#84994f",
                color: "#84994f",
                borderWidth: "2px",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Books Section for non-logged in users */}
      <section className="popular-books-section py-5">
        <div className="container">
          <h2 className="text-center fw-bold color-4 mb-5 display-5">
            Popular Books
          </h2>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border color-1" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {recommendations.slice(0, 4).map((book) => (
                <div key={book.id} className="col-md-6 col-lg-3">
                  <div className="book-card background-2 rounded shadow-bottom h-100">
                    <div
                      className="w-100 background-4 d-flex align-items-center justify-content-center"
                      style={{ height: "250px" }}
                    >
                      <BookOpen size={48} className="color-1" />
                    </div>
                    <div className="p-3">
                      <h5 className="fw-bold color-4 mb-2">{book.title}</h5>
                      <p className="color-1 mb-2">{book.author}</p>
                      {book.avgRating && (
                        <span className="color-1">
                          ⭐ {book.avgRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rest of your landing page sections... */}
    </div>
  );
}
