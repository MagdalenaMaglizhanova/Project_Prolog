import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Добавяне на клас за темата към body
  useEffect(() => {
    document.body.className = `login-page ${theme}`;
    return () => {
      document.body.className = '';
    };
  }, [theme]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Вземане на Firestore данни за потребителя
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("User data from Firestore:", userData);
      } else {
        console.warn("No user data found in Firestore!");
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-page ${theme}`}>
      <div className="login-background">
        <div className="login-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-content">
          <div className="login-branding">
            <div className="brand-logo">
              <div className="logo-text-container">
                <span className="logo-text">IDEAS</span>
                <span className="logo-subtitle">{t('innovation_platform') || "Innovation Platform"}</span>
              </div>
            </div>

            <div className="brand-content">
              <h1 className="brand-title">
                {t('welcome_back') || "Welcome Back to"}
                <span className="title-gradient"> IDEAS</span>
              </h1>
              <p className="brand-description">
                {t('login_description') || "Continue your journey in AI-powered STEM education and explore interactive programming concepts."}
              </p>
              <div className="brand-features">
                <div className="brand-feature">
                  <i className="fas fa-rocket"></i>
                  <span>{t('access_projects') || "Access your projects"}</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-chart-line"></i>
                  <span>{t('track_progress') || "Track your progress"}</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-users"></i>
                  <span>{t('collaborate_peers') || "Collaborate with peers"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="login-form-section">
            <div className="login-form-container">
              <div className="form-header">
                <h2 className="form-title">{t('sign_in_account') || "Sign In to Your Account"}</h2>
                <p className="form-subtitle">{t('enter_credentials') || "Enter your credentials to continue learning"}</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                {error && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope"></i>
                    {t('email_address') || "Email Address"}
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    placeholder={t('enter_email') || "Enter your email"} 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock"></i>
                    {t('password') || "Password"}
                  </label>
                  <input 
                    type="password" 
                    id="password"
                    placeholder={t('enter_password') || "Enter your password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>{t('remember_me') || "Remember me"}</span>
                  </label>
                  <a href="#" className="forgot-password">
                    {t('forgot_password') || "Forgot password?"}
                  </a>
                </div>

                <button 
                  type="submit" 
                  className={`login-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      {t('signing_in') || "Signing In..."}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i>
                      {t('sign_in_ideas') || "Sign In to IDEAS"}
                    </>
                  )}
                </button>

                <div className="divider">
                  <span>{t('new_to_ideas') || "New to IDEAS?"}</span>
                </div>

                <Link to="/register" className="register-link">
                  <i className="fas fa-user-plus"></i>
                  {t('create_account') || "Create an Account"}
                </Link>
              </form>

              <div className="login-footer">
                <p>{t('terms_agreement') || "By continuing, you agree to our"} 
                  <a href="#"> {t('terms_of_service') || "Terms of Service"}</a> {t('and') || "and"} 
                  <a href="#"> {t('privacy_policy') || "Privacy Policy"}</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}