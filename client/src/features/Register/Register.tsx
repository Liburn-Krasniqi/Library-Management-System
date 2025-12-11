import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Card } from "../../components/UI";
import { useAuth } from "../../providers";

export function Register() {
  const { loginAction } = useAuth(); // <-- get login function

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3333/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Signup failed");

      // --- Auto login immediately after signup ---
      await loginAction(
        { email: form.email, password: form.password },
        "http://localhost:3333/"
      );

      // navigate happens inside loginAction, no need to do it again
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="w-50">
        <h1 className="color-1">Sign Up</h1>
        <br />

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="Enter First and Last Name"
              value={form.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <p>
              Already have an account?
              <Link
                className="color-2"
                style={{ textDecoration: "none" }}
                to="/login"
              >
                <strong> Log In</strong>
              </Link>
            </p>

            <Button
              className="background-1 border-0"
              type="button"
              onClick={handleSubmit}
            >
              Register
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
