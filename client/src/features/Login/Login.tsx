import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Card } from "../../components/UI";
import { useState } from "react";
import { useAuth } from "../../providers";
import { BookOpen, Mail, Lock, ArrowRight } from "lucide-react";
import "./Login.css";

export function Login() {
  const { loginAction } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginAction({ email, password }, "http://localhost:3333/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center my-5">
      <Card className="login-card shadow-bottom">
        <div className="text-center mb-4">
          <div className="login-icon-wrapper mb-3">
            <BookOpen size={48} className="color-2" />
          </div>
          <h1 className="color-1 fw-bold mb-2">Welcome Back!</h1>
          <p className="text-muted">Sign in to continue your reading journey</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group
            className="mb-4 form-group-custom"
            controlId="formBasicEmail"
          >
            <Form.Label className="fw-semibold">
              <Mail size={18} className="me-2 color-2" />
              Email address
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-4 form-group-custom" controlId="formPW">
            <Form.Label className="fw-semibold">
              <Lock size={18} className="me-2 color-2" />
              Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control-custom"
            />
            <div className="text-end mt-2">
              <Link
                to="/forgot-password"
                className="text-decoration-none color-4 small forgot-link"
              >
                Forgot password?
              </Link>
            </div>
          </Form.Group>

          <Button
            className="background-1 border-0 w-100 py-3 mb-4 fw-bold login-button"
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
                Signing in...
              </>
            ) : (
              <>
                Log In
                <ArrowRight size={20} className="ms-2" />
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="mb-0 text-muted">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-decoration-none color-2 fw-bold register-link"
              >
                Create one now
              </Link>
            </p>
          </div>
        </Form>

        <div className="divider my-4">
          <span className="divider-text">or</span>
        </div>

        <div className="text-center">
          <p className="text-muted small mb-0">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="color-4 text-decoration-none">
              Terms
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
