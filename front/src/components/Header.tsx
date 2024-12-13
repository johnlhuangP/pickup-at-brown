import { Navbar, Container, Nav } from 'react-bootstrap';
//import NavDropdown from 'react-bootstrap/NavDropdown';
import styles from './header.module.css';
//import React from 'react';

import {
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/clerk-react";

const Header = () => {
    return (
      <Navbar
        expand="lg"
        className={`bg-body-tertiary ${styles.navbar}`}
        sticky="top"
      >
        <Navbar.Brand href="/" className={styles.navbarBrand}>
          Pickup@Brown
        </Navbar.Brand>
        <Container>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className={styles.navbarToggler}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" fill variant="tabs">
              {/* <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link> */}
            </Nav>
            <Nav
              className="justify-content-end"
              defaultActiveKey="#home"
              variant="underline"
            >
              <Nav.Item>
                <Nav.Link href="/about" className={styles.navLink}>
                  About
                </Nav.Link>
              </Nav.Item>
              <SignedOut>
                <Nav.Item>
                  <Nav.Link href="/sign-up" className={styles.navLink}>
                    Register
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/sign-in" className={styles.navLink}>
                    Sign In
                  </Nav.Link>
                </Nav.Item>
              </SignedOut>
              <SignedIn>
              <Nav.Item>
                <Nav.Link href="/profile" className={styles.navLink}>
                  Profile
                </Nav.Link>
              </Nav.Item>
                <Nav.Item>
                  <SignOutButton>
                    <Nav.Link className={styles.navLink}>Sign Out</Nav.Link>
                  </SignOutButton>
                </Nav.Item>
              </SignedIn>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}
export default Header;