import React from 'react';
import '../styles/Navbar.css';

/**
 * Navbar component displaying application title and branding
 */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-icon" aria-hidden="true">📅</span>
          <h1 className="navbar-title">Appointment Scheduler</h1>
        </div>
        <span className="navbar-badge">Easy Booking</span>
      </div>
    </nav>
  );
}

export default Navbar;
