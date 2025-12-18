import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Card } from "../../components/UI";
import { useAuth } from "../../providers";
import { BookOpen, User, Mail, Lock, ArrowRight, Check } from "lucide-react";
import "./Register.css";

export function Register() {
  const { loginAction } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:3333/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
      }

      // Auto login immediately after signup
      await loginAction(
        { email: form.email, password: form.password },
        "http://localhost:3333/"
      );
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center my-5">
      <Card className="register-card shadow-bottom">
        <div className="text-center mb-4">
          <div className="register-icon-wrapper mb-3">
            <BookOpen size={48} className="color-2" />
          </div>
          <h1 className="color-1 fw-bold mb-2">Join ReadSite</h1>
          <p className="text-muted">Start your reading journey today</p>
        </div>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
              aria-label="Close"
            ></button>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4 form-group-custom" controlId="formName">
            <Form.Label className="fw-semibold">
              <User size={18} className="me-2 color-2" />
              Full Name
            </Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-4 form-group-custom" controlId="formEmail">
            <Form.Label className="fw-semibold">
              <Mail size={18} className="me-2 color-2" />
              Email address
            </Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group
            className="mb-4 form-group-custom"
            controlId="formPassword"
          >
            <Form.Label className="fw-semibold">
              <Lock size={18} className="me-2 color-2" />
              Password
            </Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="form-control-custom"
            />
            <Form.Text className="text-muted small">
              Must be at least 6 characters long
            </Form.Text>
          </Form.Group>

          <div className="benefits-box mb-4">
            <p className="fw-semibold mb-2 color-4">What you'll get:</p>
            <ul className="benefits-list">
              <li>
                <Check size={16} className="color-2 me-2" />
                Track unlimited books
              </li>
              <li>
                <Check size={16} className="color-2 me-2" />
                Personalized recommendations
              </li>
              <li>
                <Check size={16} className="color-2 me-2" />
                Reading statistics & insights
              </li>
            </ul>
          </div>

          <Button
            className="background-1 border-0 w-100 py-3 mb-4 fw-bold register-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating your account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={20} className="ms-2" />
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="mb-0 text-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-decoration-none color-2 fw-bold login-link"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Form>

        <div className="divider my-4">
          <span className="divider-text">or</span>
        </div>

        <div className="text-center">
          <p className="text-muted small mb-0">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="color-4 text-decoration-none">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="color-4 text-decoration-none">
              Privacy Policy
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
