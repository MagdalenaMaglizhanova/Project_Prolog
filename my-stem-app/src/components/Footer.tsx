import { Link } from 'react-router-dom';
import './Footer.css';

const logo = '/images/logo.png';
const facebookIcon = '/images/facebook.png';
const twitterIcon = '/images/twitter.png';
const instagramIcon = '/images/instagram.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <div className="footer-logo">
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
            </div>
            <p className="footer-description">
              Empowering the next generation of innovators through logical programming 
              and AI education. Transforming STEM learning worldwide.
            </p>
            <div className="social-links">
              {[
                { 
                  name: 'Facebook', 
                  icon: facebookIcon, 
                  url: 'https://facebook.com',
                  fallback: 'fab fa-facebook-f'
                },
                { 
                  name: 'Twitter', 
                  icon: twitterIcon, 
                  url: 'https://twitter.com',
                  fallback: 'fab fa-twitter'
                },
                { 
                  name: 'Instagram', 
                  icon: instagramIcon, 
                  url: 'https://instagram.com',
                  fallback: 'fab fa-instagram'
                },
                { 
                  name: 'LinkedIn', 
                  icon: null, 
                  url: 'https://linkedin.com',
                  fallback: 'fab fa-linkedin-in'
                },
                { 
                  name: 'GitHub', 
                  icon: null, 
                  url: 'https://github.com',
                  fallback: 'fab fa-github'
                }
              ].map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  className="social-button"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon ? (
                    <img 
                      src={social.icon} 
                      alt={`${social.name} icon`}
                      className="social-icon-img"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <i className={social.fallback} style={{ display: social.icon ? 'none' : 'flex' }}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Platform Links */}
          <div className="footer-links">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-list">
              {[
                { name: 'Home', href: '/', icon: 'fas fa-home' },
                { name: 'Topics', href: '/topics', icon: 'fas fa-comments' },
                { name: 'Submissions', href: '/submissions', icon: 'fas fa-paper-plane' },
                { name: 'Dashboard', href: '/dashboard', icon: 'fas fa-chart-line' },
                { name: 'Documentation', href: '/docs', icon: 'fas fa-book' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="footer-link">
                    <i className={link.icon}></i>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div className="footer-links">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-list">
              {[
                { name: 'Help Center', href: '/help', icon: 'fas fa-question-circle' },
                { name: 'Contact Us', href: '/contact', icon: 'fas fa-envelope' },
                { name: 'Privacy Policy', href: '/privacy', icon: 'fas fa-shield-alt' },
                { name: 'Terms of Service', href: '/terms', icon: 'fas fa-file-contract' },
                { name: 'Cookies', href: '/cookies', icon: 'fas fa-cookie' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="footer-link">
                    <i className={link.icon}></i>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} IDEAS Platform. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy" className="legal-link">Privacy</Link>
            <Link to="/terms" className="legal-link">Terms</Link>
            <Link to="/cookies" className="legal-link">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}