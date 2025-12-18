import { Link } from "react-router-dom";
import { BookOpen, Users, TrendingUp, Sparkles } from "lucide-react";
import type { JSX } from "react";

export function Landing(): JSX.Element {
  return (
    <div className="landing-page">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <h2 className="text-center fw-bold color-4 mb-5 display-5">
            Why Choose ReadSite?
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="feature-card background-2 p-4 rounded shadow-bottom h-100 text-center">
                <div className="mb-3">
                  <BookOpen size={48} className="color-1" />
                </div>
                <h4 className="fw-bold color-1 mb-3">Track Your Books</h4>
                <p className="color-4">
                  Organize your reading list, mark books as read, and keep track
                  of your literary journey.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="feature-card background-2 p-4 rounded shadow-bottom h-100 text-center">
                <div className="mb-3">
                  <Sparkles size={48} className="color-1" />
                </div>
                <h4 className="fw-bold color-1 mb-3">Discover Books</h4>
                <p className="color-4">
                  Explore curated recommendations and find your next favorite
                  read with ease.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="feature-card background-2 p-4 rounded shadow-bottom h-100 text-center">
                <div className="mb-3">
                  <TrendingUp size={48} className="color-1" />
                </div>
                <h4 className="fw-bold color-1 mb-3">Reading Stats</h4>
                <p className="color-4">
                  Visualize your reading habits and celebrate your achievements
                  with detailed statistics.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="feature-card background-2 p-4 rounded shadow-bottom h-100 text-center">
                <div className="mb-3">
                  <Users size={48} className="color-1" />
                </div>
                <h4 className="fw-bold color-1 mb-3">Join Community</h4>
                <p className="color-4">
                  Connect with readers who share your passion for books and
                  great stories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 mt-5">
        <div className="container">
          <div className="background-4 rounded shadow-bottom p-5 text-center">
            <h2 className="display-5 fw-bold color-2 mb-4">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="fs-5 color-3 mb-4">
              Join thousands of readers who are already tracking their books
              with ReadSite.
            </p>
            <Link
              to="/register"
              className="btn btn-lg background-1 color-white px-5 py-3 fw-bold shadow-bottom"
            >
              Sign Up Now - It's Free!
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 mt-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold color-1">10K+</h3>
                <p className="fs-5 color-4">Active Readers</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold color-1">50K+</h3>
                <p className="fs-5 color-4">Books Tracked</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold color-1">100K+</h3>
                <p className="fs-5 color-4">Reviews Shared</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
