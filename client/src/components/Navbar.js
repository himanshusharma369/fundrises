import React from "react";
import Profile from "../Profile";

const Navbar = ({ darkMode, setDarkMode, token, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand">🚀 FundRise</div>
        <div className="nav-actions">
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <Profile token={token} />
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;