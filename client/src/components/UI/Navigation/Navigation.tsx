import {
  Container,
  Nav,
  Navbar,
  Offcanvas,
  NavDropdown,
} from "react-bootstrap";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../providers"; // adjust path
import classes from "./Navigation.module.css";

export function Navigation() {
  const auth = useAuth();
  const username = auth.user?.name;
  const role = auth.user?.role;

  // Extract initials like: John Doe → JD
  const initials =
    username && username.includes(" ")
      ? username.split(" ")[0][0] + username.split(" ")[1][0]
      : username
      ? username[0]
      : "";

  return (
    <Navbar
      key={"lg"}
      expand={"lg"}
      className={`background-4 mb-3 shadow-bottom ${classes.test}`}
    >
      <Container fluid>
        <Navbar.Brand className="color-2 fs-1 fw-bold" as={Link} to="/">
          ReadSite
        </Navbar.Brand>

        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement="end"
          className="border-0"
        >
          <Offcanvas.Header closeButton className="background-2 shadow-bottom">
            <Offcanvas.Title
              id={`offcanvasNavbarLabel-expand-lg`}
              className="color-3 fw-bold fs-2"
            >
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3 fw-bold">
              <Nav.Link className="color-2" as={Link} to="/">
                Home
              </Nav.Link>
              {role === "USER" && (
                <Nav.Link className="color-2" as={Link} to="/books">
                  My Books
                </Nav.Link>
              )}
              {role === "ADMIN" && (
                <Nav.Link className="color-2" as={Link} to="/admin/users">
                  Dashboard
                </Nav.Link>
              )}

              {/* Show Sign Up when NOT logged in */}
              {!username && (
                <Nav.Link className="color-2" as={Link} to="/register">
                  Sign Up
                </Nav.Link>
              )}

              {/* Show Profile/Logout when logged in */}
              {username ? (
                <NavDropdown
                  align="end"
                  title={initials}
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item
                    className="text-danger"
                    onClick={() => auth.logOut()}
                  >
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link className="color-3" as={Link} to="/login">
                  <CircleUserRound />
                </Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
