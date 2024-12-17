import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";

// Import the pages
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Register from "./pages/Register";
import PublicProfilePage from "./pages/PublicProfilePage";


// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="content">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route
                path="/register"
                element={
                  <ProtectedRoute>
                    <Register />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/public-profile/:profileUserId"
                element={<PublicProfilePageWrapper />}
              />

              <Route path="/sign-in" element={<SignInPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

function PublicProfilePageWrapper() {
  const { profileUserId } = useParams();
  const numericUserId = profileUserId ? parseInt(profileUserId, 10) : 0;
  return <PublicProfilePage profileUserId={numericUserId} />;
}

export default App;



