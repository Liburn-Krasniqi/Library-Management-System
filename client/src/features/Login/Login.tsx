import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Card } from "../../components/UI";
import { useState } from "react";
import { useAuth } from "../../providers";

export function Login() {
  const { loginAction } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    await loginAction({ email, password }, "http://localhost:3333/");
  };

  return (
    <div className="d-flex justify-content-center my-5">
      <Card className="w-50">
        <h1 className="color-1">Log In</h1>
        <br />

        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPW">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <p>
              Don't have an account?
              <Link
                to="/register"
                style={{ textDecoration: "none" }}
                className="color-2"
              >
                <strong> Register</strong>
              </Link>
            </p>

            <Button
              className="background-1 border-0"
              type="button"
              onClick={handleSubmit}
            >
              Log In
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
