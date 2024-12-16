import { Navbar, Container, Nav } from 'react-bootstrap';
import styles from './header.module.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={styles.header}>
      <Navbar bg="light" expand="lg" className={styles.navbar}>
        <Container>
          <Navbar.Brand href="/">Pickup at Brown</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              {user && <Nav.Link href="/profile">Profile</Nav.Link>}
            </Nav>
            <Nav>
              {user ? (
                <Nav.Link onClick={handleSignOut}>Sign Out</Nav.Link>
              ) : (
                <>
                  <Nav.Link href="/sign-in">Sign In</Nav.Link>
                  <Nav.Link href="/sign-up">Sign Up</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;