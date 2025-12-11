import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Card } from "../../components/UI";

export function Register() {
  return (
    <div className="d-flex justify-content-center">
      <Card className="w-50">
        <h1 className="color-1">Sign Up</h1>
        <br />

        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter First and Last Name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" placeholder="Phone Nr" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Address" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPW">
            <Form.Label>Password</Form.Label>
            <Form.Control type="text" placeholder="Password" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBD">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <p>
              Already have an account?
              <Link
                style={{ textDecoration: "none" }}
                className="color-2"
                to="/login"
              >
                <strong> Log In</strong>
              </Link>
            </p>

            <Button className="background-1 border-0" type="button">
              Register
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
