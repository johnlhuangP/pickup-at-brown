import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
// import Sidebar from './components/Sidebar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';

// Import the pages
 import HomePage from './pages/HomePage';
// import AboutPage from './pages/AboutPage';
// import ProfilePage from './pages/ProfilePage';

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
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
