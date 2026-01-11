import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Използване на контексти
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, languageOptions, currentLanguage, t } = useLanguage();

  // Ref за управление на кликове извън менюто
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Затваряне на менюто за език при клик извън него
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && 
          !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleLanguageChange = (langCode: 'en' | 'bg' | 'es') => {
    setLanguage(langCode);
    setIsLanguageMenuOpen(false);
    setIsMenuOpen(false);
  };

  const getFlagClass = (code: 'en' | 'bg' | 'es') => {
    switch (code) {
      case 'en': return styles.flagEnglish;
      case 'bg': return styles.flagBulgarian;
      case 'es': return styles.flagSpanish;
      default: return '';
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.headerContainer}>
        {/* Logo with Lightbulb - ВЛЯВО */}
        <Link to="/" className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <div className={styles.lightbulbIcon}>
              <i className="fas fa-lightbulb"></i>
            </div>
          </div>
          <div className={styles.logoTextContainer}>
            <span className={styles.logoText}>IDEAS</span>
            <span className={styles.logoSubtitle}>{t('innovation_platform')}</span>
          </div>
        </Link>

        {/* Desktop Nav - СЛЕД ЛОГОТО */}
        <nav className={styles.desktopNav}>
          <Link
            to="/"
            className={`${styles.navLink} ${isActiveRoute("/") ? styles.navLinkActive : ""}`}
          >
            <i className="fas fa-home"></i> 
            <span className={styles.navLinkText}>{t('home')}</span>
          </Link>

          <Link
            to={user ? "/topics" : "#"}
            className={`${styles.navLink} ${!user ? styles.navLinkDisabled : ""} ${isActiveRoute("/topics") ? styles.navLinkActive : ""}`}
            onClick={!user ? handleDisabledLink : undefined}
          >
            <i className="fas fa-book-open"></i> 
            <span className={styles.navLinkText}>{t('topics')}</span>
          </Link>

          <Link
            to={user ? "/dashboard" : "#"}
            className={`${styles.navLink} ${!user ? styles.navLinkDisabled : ""} ${isActiveRoute("/dashboard") ? styles.navLinkActive : ""}`}
            onClick={!user ? handleDisabledLink : undefined}
          >
            <i className="fas fa-chart-line"></i> 
            <span className={styles.navLinkText}>{t('dashboard')}</span>
          </Link>

          {user && (
            <Link
              to="/chat"
              className={`${styles.navLink} ${isActiveRoute("/chat") ? styles.navLinkActive : ""}`}
            >
              <i className="fas fa-robot"></i> 
              <span className={styles.navLinkText}>{t('prolog_chat')}</span>
            </Link>
          )}
        </nav>

        {/* Controls + Auth */}
        <div className={styles.headerRightSection}>
          {/* Theme and Language Controls */}
          <div className={styles.controlsSection}>
            <button
              className={styles.themeButton}
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
            </button>

            <div className={styles.languageSelector} ref={languageMenuRef}>
              <button
                className={styles.languageButton}
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              >
                <span className={`${styles.flag} ${getFlagClass(language)}`}>
                  {currentLanguage?.flag}
                </span>
                <span className={styles.languageLabel}>{currentLanguage?.label}</span>
                <i className={`fas fa-chevron-${isLanguageMenuOpen ? 'up' : 'down'}`}></i>
              </button>

              <div className={`${styles.languageMenu} ${isLanguageMenuOpen ? styles.languageMenuOpen : ''}`}>
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    className={`${styles.languageOption} ${language === option.code ? styles.languageOptionActive : ''}`}
                    onClick={() => handleLanguageChange(option.code)}
                  >
                    <span className={`${styles.flag} ${getFlagClass(option.code)}`}>
                      {option.flag}
                    </span>
                    <span>{option.name}</span>
                    {language === option.code && (
                      <i className="fas fa-check ml-auto" style={{fontSize: '0.8rem'}}></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Auth Section */}
          <div className={styles.authSection}>
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className={`${styles.authLink} ${styles.loginLink}`}
                >
                  <i className="fas fa-sign-in-alt"></i> 
                  <span className={styles.authText}>{t('sign_in')}</span>
                </Link>

                <Link 
                  to="/register" 
                  className={`${styles.authLink} ${styles.registerLink}`}
                >
                  <i className="fas fa-rocket"></i> 
                  <span className={styles.authText}>{t('get_started')}</span>
                </Link>
              </>
            ) : (
              <div className={styles.userMenu}>
                <div className={styles.userInfo}>
                  <i className={`fas fa-user ${styles.userAvatar}`}></i>
                  <span className={styles.userEmail}>
                    {user.email}
                  </span>
                </div>
                <button 
                  className={styles.logoutButton}
                  onClick={handleLogout}
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className={styles.logoutText}>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.menuLine} ${isMenuOpen ? styles.menuLine1Open : ''}`}></span>
          <span className={`${styles.menuLine} ${isMenuOpen ? styles.menuLine2Open : ''}`}></span>
          <span className={`${styles.menuLine} ${isMenuOpen ? styles.menuLine3Open : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        {/* Mobile Controls */}
        <div className={styles.mobileControlsSection}>
          <button
            className={styles.mobileThemeButton}
            onClick={toggleTheme}
          >
            <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <div className={styles.languageSelector}>
            <button
              className={styles.mobileLanguageButton}
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            >
              <span className={`${styles.flag} ${getFlagClass(language)}`}>
                {currentLanguage?.flag}
              </span>
              <span>{currentLanguage?.label}</span>
              <i className={`fas fa-chevron-${isLanguageMenuOpen ? 'up' : 'down'}`} style={{marginLeft: 'auto'}}></i>
            </button>

            <div className={`${styles.languageMenu} ${isLanguageMenuOpen ? styles.languageMenuOpen : ''}`}>
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  className={`${styles.languageOption} ${language === option.code ? styles.languageOptionActive : ''}`}
                  onClick={() => handleLanguageChange(option.code)}
                >
                  <span className={`${styles.flag} ${getFlagClass(option.code)}`}>
                    {option.flag}
                  </span>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <nav className={styles.mobileNav}>
          <Link
            to="/"
            className={`${styles.mobileNavLink} ${isActiveRoute("/") ? styles.mobileNavLinkActive : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-home"></i> 
            <span>{t('home')}</span>
          </Link>

          <Link
            to={user ? "/topics" : "#"}
            className={`${styles.mobileNavLink} ${!user ? styles.navLinkDisabled : ""} ${isActiveRoute("/topics") ? styles.mobileNavLinkActive : ""}`}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                handleDisabledLink(e);
              } else {
                setIsMenuOpen(false);
              }
            }}
          >
            <i className="fas fa-book-open"></i> 
            <span>{t('topics')}</span>
          </Link>

          <Link
            to={user ? "/dashboard" : "#"}
            className={`${styles.mobileNavLink} ${!user ? styles.navLinkDisabled : ""} ${isActiveRoute("/dashboard") ? styles.mobileNavLinkActive : ""}`}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                handleDisabledLink(e);
              } else {
                setIsMenuOpen(false);
              }
            }}
          >
            <i className="fas fa-chart-line"></i> 
            <span>{t('dashboard')}</span>
          </Link>

          {user && (
            <Link
              to="/chat"
              className={`${styles.mobileNavLink} ${isActiveRoute("/chat") ? styles.mobileNavLinkActive : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-robot"></i> 
              <span>{t('prolog_chat')}</span>
            </Link>
          )}
        </nav>

        <div className={styles.mobileAuthSection}>
          {!user ? (
            <>
              <Link 
                to="/login" 
                className={`${styles.authLink} ${styles.loginLink}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt"></i> 
                <span>{t('sign_in')}</span>
              </Link>

              <Link 
                to="/register" 
                className={`${styles.authLink} ${styles.registerLink}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-rocket"></i> 
                <span>{t('get_started')}</span>
              </Link>
            </>
          ) : (
            <>
              <div className={styles.mobileUserInfo}>
                <i className={`fas fa-user ${styles.userAvatar}`}></i>
                <span className={styles.userEmail}>
                  {user.email}
                </span>
              </div>
              <button 
                className={styles.mobileLogoutButton}
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>{t('logout')}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}