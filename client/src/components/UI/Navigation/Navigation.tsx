import {
  Container,
  Nav,
  Navbar,
  Offcanvas,
  NavDropdown,
} from "react-bootstrap";
import { CircleUserRound, BookOpen, LayoutDashboard } from "lucide-react";
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
      className={`background-4 shadow-bottom ${classes.navbar}`}
      style={{ marginBottom: 0 }}
    >
      <Container fluid className="px-4">
        <Navbar.Brand
          className="fw-bold d-flex align-items-center gap-2"
          as={Link}
          to="/"
          style={{ fontSize: "1.75rem", color: "#fcb53b" }}
        >
          <BookOpen size={32} style={{ color: "#fcb53b" }} />
          <span>ReadSite</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls={`offcanvasNavbar-expand-lg`}
          className="border-0"
          style={{
            backgroundColor: "rgba(252, 181, 59, 0.2)",
            color: "#fcb53b",
          }}
        />

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement="end"
          className="border-0"
          style={{ backgroundColor: "#84994f" }}
        >
          <Offcanvas.Header closeButton className="background-2 shadow-bottom">
            <Offcanvas.Title
              id={`offcanvasNavbarLabel-expand-lg`}
              className="color-4 fw-bold fs-2 d-flex align-items-center gap-2"
            >
              <BookOpen size={28} />
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body
            className="background-3"
            style={{ backgroundColor: "#ffe797" }}
          >
            <Nav className="justify-content-end flex-grow-1 align-items-lg-center gap-2 fw-bold">
              <Nav.Link
                className={`px-3 py-2 ${classes.navLink}`}
                as={Link}
                to="/"
                style={{ color: "#fcb53b" }}
              >
                Home
              </Nav.Link>

              {role === "USER" && (
                <Nav.Link
                  className={`px-3 py-2 d-flex align-items-center gap-2 ${classes.navLink}`}
                  as={Link}
                  to="/books"
                  style={{ color: "#fcb53b" }}
                >
                  <BookOpen size={18} />
                  <span>My Books</span>
                </Nav.Link>
              )}

              {role === "ADMIN" && (
                <Nav.Link
                  className={`px-3 py-2 d-flex align-items-center gap-2 ${classes.navLink}`}
                  as={Link}
                  to="/admin/users"
                  style={{ color: "#fcb53b" }}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Nav.Link>
              )}

              {/* Show Sign Up when NOT logged in */}
              {!username && (
                <Nav.Link
                  className={`px-3 py-2 ${classes.navLink}`}
                  as={Link}
                  to="/register"
                  style={{ color: "#fcb53b" }}
                >
                  Sign Up
                </Nav.Link>
              )}

              {/* Show Profile/Logout when logged in */}
              {username ? (
                <NavDropdown
                  align="end"
                  title={
                    <span
                      className={`d-flex align-items-center justify-content-center ${classes.userBadge}`}
                    >
                      {initials}
                    </span>
                  }
                  id="navbarScrollingDropdown"
                  className={classes.userDropdown}
                >
                  <NavDropdown.Item disabled className="text-muted small">
                    Signed in as <strong>{username}</strong>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="text-danger fw-bold"
                    onClick={() => auth.logOut()}
                  >
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  className={`px-3 py-2 d-flex align-items-center ${classes.loginIcon}`}
                  as={Link}
                  to="/login"
                  style={{ color: "#fcb53b" }}
                >
                  <CircleUserRound size={28} />
                </Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
