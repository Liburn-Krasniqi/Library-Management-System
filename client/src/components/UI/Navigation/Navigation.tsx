import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";

import classes from "./Navigation.module.css";

export function Navigation() {
  return (
    <>
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
            className={"border-0"}
          >
            <Offcanvas.Header
              closeButton
              className="background-2 shadow-bottom"
            >
              <Offcanvas.Title
                id={`offcanvasNavbarLabel-expand-lg`}
                className={`color-3 fw-bold fs-2`}
              >
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3 fw-bold">
                <Nav.Link className="color-2" as={Link} to="/">
                  {/* change later  */}
                  Home
                </Nav.Link>

                <Nav.Link className="color-2" as={Link} to="/register">
                  Sign Up
                </Nav.Link>

                {/* this link should point to profile in case user is logged in // or better have the log out option */}

                <Nav.Link className="color-3" as={Link} to="/login">
                  <CircleUserRound></CircleUserRound>
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
