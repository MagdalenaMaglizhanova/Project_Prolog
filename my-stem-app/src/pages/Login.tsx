import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase"; // Firestore instance
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Автентикация на потребителя
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Вземане на Firestore данни за потребителя
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("User data from Firestore:", userData);
        // TODO: Можеш да сложиш userData в Context или state за dashboard
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
    <div className="login-page">
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
                <span className="logo-subtitle">Innovation Platform</span>
              </div>
            </div>

            <div className="brand-content">
              <h1 className="brand-title">
                Welcome Back to
                <span className="title-gradient"> IDEAS</span>
              </h1>
              <p className="brand-description">
                Continue your journey in AI-powered STEM education and 
                explore interactive programming concepts.
              </p>
              <div className="brand-features">
                <div className="brand-feature">
                  <i className="fas fa-rocket"></i>
                  <span>Access your projects</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-chart-line"></i>
                  <span>Track your progress</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-users"></i>
                  <span>Collaborate with peers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="login-form-section">
            <div className="login-form-container">
              <div className="form-header">
                <h2 className="form-title">Sign In to Your Account</h2>
                <p className="form-subtitle">Enter your credentials to continue learning</p>
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
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock"></i>
                    Password
                  </label>
                  <input 
                    type="password" 
                    id="password"
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">
                    Forgot password?
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i>
                      Sign In to IDEAS
                    </>
                  )}
                </button>

                <div className="divider">
                  <span>New to IDEAS?</span>
                </div>

                <Link to="/register" className="register-link">
                  <i className="fas fa-user-plus"></i>
                  Create an Account
                </Link>
              </form>

              <div className="login-footer">
                <p>By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
