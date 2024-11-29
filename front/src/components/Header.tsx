import { Navbar, Container, Nav } from 'react-bootstrap';
//import NavDropdown from 'react-bootstrap/NavDropdown';
import styles from './header.module.css';
import {SignedOut, SignInButton} from '@clerk/clerk-react';
//import React from 'react';

const Header = () => {
    return (
        <Navbar expand="lg" className={`bg-body-tertiary ${styles.navbar}`} sticky="top">
            <Navbar.Brand href="/" className={styles.navbarBrand}>Pickup@Brown</Navbar.Brand>
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className={styles.navbarToggler} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" fill variant="tabs">
                        {/* <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link> */}
                    </Nav>
                    <Nav className="justify-content-end" defaultActiveKey="#home" variant="underline">
                        <Nav.Item>
                            <Nav.Link href="#home" className={styles.navLink}>Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#about" className={styles.navLink}>About</Nav.Link>
                        </Nav.Item>
                        
                        <SignedOut>
                            <Nav.Item>
                                <SignInButton>
                                    <Nav.Link className={styles.navLink}>Sign In</Nav.Link>
                                </SignInButton>
                            </Nav.Item>
                        </SignedOut>
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default Header;