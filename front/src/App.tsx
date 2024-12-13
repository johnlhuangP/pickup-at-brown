import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProfilePage from "./pages/ProfilePage";
// import Sidebar from './components/Sidebar';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";

// Import the pages
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Register from "./pages/Register";

import { SignIn } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Header and Sidebar are present on all pages */}
        <Header />
        {/* Main content section */}
        <div className="content">
          <Routes>
            {/* Define routes for the different pages */}
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/about" element={<AboutPage />} /> */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sign-in" element={<SignInPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
