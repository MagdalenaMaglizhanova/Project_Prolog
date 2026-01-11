import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <div className="footer-logo">
              <div className="logo-wrapper">
                <div className="lightbulb-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
              </div>
              <div className="logo-text-container">
                <span className="logo-text">IDEAS</span>
                <span className="logo-subtitle">
                  {t('innovation_platform')}
                </span>
              </div>
            </div>
            <p className="footer-description">
              {t('footer_description') || 'Empowering the next generation of innovators through logical programming and AI education. Transforming STEM learning worldwide.'}
            </p>
            <div className="social-links">
              {[
                { 
                  name: 'GitHub', 
                  url: 'https://github.com',
                  icon: 'fab fa-github'
                },
                { 
                  name: 'LinkedIn', 
                  url: 'https://linkedin.com',
                  icon: 'fab fa-linkedin-in'
                },
                { 
                  name: 'Twitter', 
                  url: 'https://twitter.com',
                  icon: 'fab fa-twitter'
                },
                { 
                  name: 'Facebook', 
                  url: 'https://facebook.com',
                  icon: 'fab fa-facebook-f'
                },
                { 
                  name: 'Instagram', 
                  url: 'https://instagram.com',
                  icon: 'fab fa-instagram'
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
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Platform Links */}
          <div className="footer-links">
            <h4 className="footer-heading">
              {t('footer_platform') || 'Platform'}
            </h4>
            <ul className="footer-list">
              {[
                { nameKey: 'home', href: '/', icon: 'fas fa-home' },
                { nameKey: 'topics', href: '/topics', icon: 'fas fa-comments' },
                { nameKey: 'submissions', href: '/submissions', icon: 'fas fa-paper-plane' },
                { nameKey: 'dashboard', href: '/dashboard', icon: 'fas fa-chart-line' },
                { nameKey: 'documentation', href: '/docs', icon: 'fas fa-book' }
              ].map((link) => (
                <li key={link.nameKey}>
                  <Link to={link.href} className="footer-link">
                    <i className={link.icon}></i>
                    {t(link.nameKey as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div className="footer-links">
            <h4 className="footer-heading">
              {t('footer_support') || 'Support'}
            </h4>
            <ul className="footer-list">
              {[
                { nameKey: 'help_center', href: '/help', icon: 'fas fa-question-circle' },
                { nameKey: 'contact_us', href: '/contact', icon: 'fas fa-envelope' },
                { nameKey: 'privacy_policy', href: '/privacy', icon: 'fas fa-shield-alt' },
                { nameKey: 'terms_of_service', href: '/terms', icon: 'fas fa-file-contract' },
                { nameKey: 'cookies', href: '/cookies', icon: 'fas fa-cookie' }
              ].map((link) => (
                <li key={link.nameKey}>
                  <Link to={link.href} className="footer-link">
                    <i className={link.icon}></i>
                    {t(link.nameKey as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} IDEAS Platform. {t('all_rights_reserved') || 'All rights reserved.'}
          </p>
          <div className="footer-legal">
            <Link to="/privacy" className="legal-link">
              {t('privacy') || 'Privacy'}
            </Link>
            <Link to="/terms" className="legal-link">
              {t('terms') || 'Terms'}
            </Link>
            <Link to="/cookies" className="legal-link">
              {t('cookies') || 'Cookies'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}