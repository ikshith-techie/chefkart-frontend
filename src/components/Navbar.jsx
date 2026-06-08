import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, logout } = useContext(AuthContext);
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          Chef<span>Kart</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="navbar-nav desktop-only">
          <ul>
            <li><Link to="/" className={isActive('/')}>Home</Link></li>
            <li><Link to="/chefs" className={isActive('/chefs')}>Our Chefs</Link></li>
            <li><Link to="/services" className={isActive('/services')}>Services</Link></li>
            {isAuthenticated && (
              <>
                <li><Link to="/booking" className={isActive('/booking')}>Book a Chef</Link></li>
                <li><Link to="/my-bookings" className={isActive('/my-bookings')}>My Bookings</Link></li>
              </>
            )}
            
            <li className="nav-divider"></li>
            
            {isAuthenticated ? (
              <>
                <li className="user-greeting">Hi, {user.name || 'User'}</li>
                <li><button onClick={handleLogout} className="btn-outline">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="nav-link-login">Login</Link></li>
                <li><Link to="/register" className="btn-primary">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'show' : ''}`} onClick={toggleMenu}></div>
      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <span className="navbar-brand">Chef<span>Kart</span></span>
          <button className="close-btn" onClick={toggleMenu}>✕</button>
        </div>
        <ul>
          <li><Link to="/" onClick={toggleMenu} className={isActive('/')}>Home</Link></li>
          <li><Link to="/chefs" onClick={toggleMenu} className={isActive('/chefs')}>Our Chefs</Link></li>
          <li><Link to="/services" onClick={toggleMenu} className={isActive('/services')}>Services</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/booking" onClick={toggleMenu} className={isActive('/booking')}>Book a Chef</Link></li>
              <li><Link to="/my-bookings" onClick={toggleMenu} className={isActive('/my-bookings')}>My Bookings</Link></li>
            </>
          )}
        </ul>
        
        <div className="mobile-nav-footer">
          {isAuthenticated ? (
            <>
              <p className="user-greeting-mobile">Logged in as <strong>{user.name || 'User'}</strong></p>
              <button onClick={() => { handleLogout(); toggleMenu(); }} className="btn-outline w-100">Logout</button>
            </>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" onClick={toggleMenu} className="btn-outline w-100">Login</Link>
              <Link to="/register" onClick={toggleMenu} className="btn-primary w-100">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
