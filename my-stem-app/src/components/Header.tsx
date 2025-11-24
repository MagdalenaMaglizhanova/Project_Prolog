import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import './Header.css';

const logo = '/images/logo.png'; 

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveRoute = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDisabledLink = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Please login to access this page');
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">

        {/* Logo */}
        <Link to="/" className="logo-section">
          <div className="logo-wrapper">
            <img
              src={logo}
              alt="IDEAS Logo"
              className="logo-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="logo-fallback">
              <i className="fas fa-lightbulb"></i>
            </div>
          </div>
          <div className="logo-text-container">
            <span className="logo-text">IDEAS</span>
            <span className="logo-subtitle">Innovation Platform</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <Link
            to="/"
            className={`nav-link ${isActiveRoute("/") ? "nav-link-active" : ""}`}
          >
            <i className="fas fa-home"></i> Home
          </Link>

          <Link
            to={user ? "/topics" : "#"}
            className={`nav-link ${!user ? "nav-link-disabled" : ""} ${isActiveRoute("/topics") ? "nav-link-active" : ""}`}
            onClick={!user ? handleDisabledLink : undefined}
          >
            <i className="fas fa-comments"></i> Topics
          </Link>

          <Link
            to={user ? "/submissions" : "#"}
            className={`nav-link ${!user ? "nav-link-disabled" : ""} ${isActiveRoute("/submissions") ? "nav-link-active" : ""}`}
            onClick={!user ? handleDisabledLink : undefined}
          >
            <i className="fas fa-paper-plane"></i> Submissions
          </Link>

          <Link
            to={user ? "/dashboard" : "#"}
            className={`nav-link ${!user ? "nav-link-disabled" : ""} ${isActiveRoute("/dashboard") ? "nav-link-active" : ""}`}
            onClick={!user ? handleDisabledLink : undefined}
          >
            <i className="fas fa-chart-line"></i> Dashboard
          </Link>

          {user && (
            <Link
              to="/chat"
              className={`nav-link ${isActiveRoute("/chat") ? "nav-link-active" : ""}`}
            >
              <i className="fas fa-robot"></i> Prolog Chat
            </Link>
          )}
        </nav>

        {/* Search + Auth */}
        <div className="header-right-section">
          <div className="search-section">
            <i className="fas fa-search search-icon"></i>
            <input type="text" placeholder="Search ideas..." className="search-input" />
          </div>

          <div className="auth-section">
            {!user ? (
              <>
                <Link to="/login" className="auth-link login-link">
                  <i className="fas fa-sign-in-alt"></i> Sign in
                </Link>

                <Link to="/register" className="auth-link register-link">
                  <i className="fas fa-rocket"></i> Get Started
                </Link>
              </>
            ) : (
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-email">{user.email}</span>
                </div>
                <button 
                  className="logout-button"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`menu-line ${isMenuOpen ? 'menu-line-1-open' : ''}`}></span>
          <span className={`menu-line ${isMenuOpen ? 'menu-line-2-open' : ''}`}></span>
          <span className={`menu-line ${isMenuOpen ? 'menu-line-3-open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : ''}`}>

        <div className="mobile-search-section">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search ideas..." className="mobile-search-input" />
        </div>

        <nav className="mobile-nav">
          <Link
            to="/"
            className={`mobile-nav-link ${isActiveRoute("/") ? "mobile-nav-link-active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-home"></i> Home
          </Link>

          <Link
            to={user ? "/topics" : "#"}
            className={`mobile-nav-link ${!user ? "nav-link-disabled" : ""} ${isActiveRoute("/topics") ? "mobile-nav-link-active" : ""}`}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                handleDisabledLink(e);
              } else {
                setIsMenuOpen(false);
              }
            }}
          >
            <i className="fas fa-comments"></i> Topics
          </Link>

          <Link
            to={user ? "/submissions" : "#"}
            className={`mobile-nav-link ${!user ? "nav-link-disabled" : ""} ${isActiveRoute("/submissions") ? "mobile-nav-link-active" : ""}`}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                handleDisabledLink(e);
              } else {
                setIsMenuOpen(false);
              }
            }}
          >
            <i className="fas fa-paper-plane"></i> Submissions
          </Link>

          <Link
            to={user ? "/dashboard" : "#"}
            className={`mobile-nav-link ${!user ? "nav-link-disabled" : ""} ${isActiveRoute("/dashboard") ? "mobile-nav-link-active" : ""}`}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                handleDisabledLink(e);
              } else {
                setIsMenuOpen(false);
              }
            }}
          >
            <i className="fas fa-chart-line"></i> Dashboard
          </Link>

          {user && (
            <Link
              to="/chat"
              className={`mobile-nav-link ${isActiveRoute("/chat") ? "mobile-nav-link-active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-robot"></i> Prolog Chat
            </Link>
          )}
        </nav>

        <div className="mobile-auth-section">
          {!user ? (
            <>
              <Link 
                to="/login" 
                className="mobile-auth-link mobile-login-link" 
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt"></i> Sign in
              </Link>

              <Link 
                to="/register" 
                className="mobile-auth-link mobile-register-link" 
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-rocket"></i> Get Started
              </Link>
            </>
          ) : (
            <>
              <div className="mobile-user-info">
                <span className="mobile-user-email">{user.email}</span>
              </div>
              <button 
                className="mobile-logout-button"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}