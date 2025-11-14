import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo-container">
        <h2 className="logo">E-Certificate</h2>
      </Link>
      
      <div className="nav-links">
        <Link to="/" className="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="currentColor">
            <path d="M6.25 17.5v-6.25h7.5v6.25h-7.5Zm0-7.917V3.333h7.5v6.25h-7.5Z"/>
          </svg>
          <span>Home</span>
        </Link>
        <Link to="/Certificate" className="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="currentColor">
            <path d="m8.333 15.833-2.5-2.5 2.5-2.5.834.834-1.667 1.666 1.667 1.667-.834.833Zm3.334 0-.834-.833 1.667-1.667-1.667-1.666.834-.834 2.5 2.5-2.5 2.5Z"/>
          </svg>
          <span>Certificate</span>
        </Link>
        <Link to="/Template" className="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="currentColor">
            <path d="M5 17.5v-15h10v15H5Zm1.667-1.667h6.666V4.167H6.667v11.666Z"/>
          </svg>
          <span>Template</span>
        </Link>
        <Link to="/Library" className="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="currentColor">
            <path d="M5 15V5h10v10H5Zm1.667-1.667h6.666V6.667H6.667v6.666Z"/>
          </svg>
          <span>Library</span>
        </Link>
      </div>

      <div className="nav-auth">
        {isLoggedIn ? (
          <div className="profile-wrapper" onClick={handleLogout}>
            <div className="profile-icon" title="Profile">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                <path d="M12 12q-1.65 0-2.825-1.175Q8 9.65 8 8q0-1.65 1.175-2.825Q10.35 4 12 4q1.65 0 2.825 1.175Q16 6.35 16 8q0 1.65-1.175 2.825Q13.65 12 12 12Zm-8 8v-2.8q0-.85.438-1.563.437-.712 1.162-1.087 1.55-.775 3.15-1.163Q10.35 13 12 13t3.25.387q1.6.388 3.15 1.163.725.375 1.162 1.087Q20 16.35 20 17.2V20H4Z"/>
              </svg>
              <span>Profile</span>
            </div>
          </div>
        ) : (
          <button className="get-started-btn" onClick={() => navigate('/login')}>
            Get Started
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
