import { Container, Row, Col, Nav, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";
import classes from "./Footer.module.css";
import type { JSX } from "react";

export function Footer(): JSX.Element {
  return (
    <footer
      className={`background-2 footer rounded-top-4 mt-auto ${classes.footer}`}
    >
      <Container fluid>
        <Row className="text-white mt-4 pb-4 px-4">
          <Col md={4} className="mb-4 mb-md-0">
            <div className={classes.footerSection}>
              <h5 className="fw-bold mb-3 color-white">Get to know us</h5>
              <Nav className="flex-column">
                <NavLink
                  as={Link}
                  to="/about"
                  className={`text-white ${classes.footerLink}`}
                >
                  About us
                </NavLink>
                <NavLink className={`text-white ${classes.footerLink}`}>
                  Careers
                </NavLink>
                <NavLink
                  as={Link}
                  to="/faq"
                  className={`text-white ${classes.footerLink}`}
                >
                  FAQ
                </NavLink>
              </Nav>
            </div>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <div className={classes.footerSection}>
              <h5 className="fw-bold mb-3 color-white">Let us help you</h5>
              <Nav className="flex-column">
                <NavLink
                  as={Link}
                  to="/contact"
                  className={`text-white d-flex align-items-center gap-2 ${classes.footerLink}`}
                >
                  <Mail size={16} />
                  Help & Contact
                </NavLink>
                <NavLink
                  as={Link}
                  to="/conditions"
                  className={`text-white ${classes.footerLink}`}
                >
                  Conditions of Use
                </NavLink>
                <NavLink
                  as={Link}
                  to="/privacy"
                  className={`text-white ${classes.footerLink}`}
                >
                  Privacy Notice
                </NavLink>
              </Nav>
            </div>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <div className={classes.footerSection}>
              <h5 className="fw-bold mb-3 color-white">Connect with us</h5>
              <Nav className="flex-column">
                <NavLink
                  href="https://facebook.com"
                  target="_blank"
                  className={`text-white d-flex align-items-center gap-2 ${classes.footerLink}`}
                >
                  <Facebook size={18} />
                  Facebook
                </NavLink>
                <NavLink
                  href="https://twitter.com"
                  target="_blank"
                  className={`text-white d-flex align-items-center gap-2 ${classes.footerLink}`}
                >
                  <Twitter size={18} />
                  Twitter
                </NavLink>
                <NavLink
                  href="https://instagram.com"
                  target="_blank"
                  className={`text-white d-flex align-items-center gap-2 ${classes.footerLink}`}
                >
                  <Instagram size={18} />
                  Instagram
                </NavLink>
              </Nav>
            </div>
          </Col>
        </Row>

        <Row
          className={`background-1 rounded-top-4 d-flex justify-content-center align-items-center ${classes.lowerFooter}`}
        >
          <p className="text-white text-center fs-5 mb-0 py-4">
            © 2025, ReadSite, Inc. All rights reserved.
          </p>
        </Row>
      </Container>
    </footer>
  );
}
