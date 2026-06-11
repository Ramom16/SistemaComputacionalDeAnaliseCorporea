import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ children }) {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <div className="logo-icon">
          <span className="logo-bar"></span>
          <span className="logo-bar"></span>
          <span className="logo-bar"></span>
        </div>
        <span className="logo-text">IRONFIT</span>
      </Link>
      <nav>
        <ul className="nav-links">
          {children}
        </ul>
      </nav>
    </header>
  );
}
