import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase"; // Увери се, че импортираш Firestore instance
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import './Register.css';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Създаване на потребител с email и password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Добавяне на документ в Firestore колекция 'users'
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      alert("Registration successful! Welcome to IDEAS.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Background similar to login section */}
      <div className="register-background">
        <div className="register-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="register-container">
        <div className="register-content">
          {/* Left Side - Branding */}
          <div className="register-branding">
            <div className="brand-logo">
              <div className="logo-wrapper">
                <div className="logo-fallback">
                  <i className="fas fa-lightbulb"></i>
                </div>
              </div>
              <div className="logo-text-container">
                <span className="logo-text">IDEAS</span>
                <span className="logo-subtitle">Innovation Platform</span>
              </div>
            </div>

            <div className="brand-content">
              <h1 className="brand-title">
                Join the
                <span className="title-gradient"> IDEAS Community</span>
              </h1>

              <p className="brand-description">
                Start your journey in AI-powered STEM education and 
                discover the world of logical programming and artificial intelligence.
              </p>

              <div className="brand-features">
                <div className="brand-feature">
                  <i className="fas fa-graduation-cap"></i>
                  <span>Interactive tutorials</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-code"></i>
                  <span>Hands-on projects</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-users"></i>
                  <span>Collaborative learning</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-chart-line"></i>
                  <span>Progress tracking</span>
                </div>
              </div>

              <div className="success-stats">
                <div className="success-stat">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Students</div>
                </div>
                <div className="success-stat">
                  <div className="stat-number">200+</div>
                  <div className="stat-label">Projects</div>
                </div>
                <div className="success-stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Schools</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="register-form-section">
            <div className="register-form-container">
              <div className="form-header">
                <h2 className="form-title">Create Your Account</h2>
                <p className="form-subtitle">Start your STEM learning journey today</p>
              </div>

              <form onSubmit={handleRegister} className="register-form">
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
                    placeholder="Create a password (min. 6 characters)" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    <i className="fas fa-lock"></i>
                    Confirm Password
                  </label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    placeholder="Confirm your password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="terms-agreement">
                    <input type="checkbox" required />
                    <span>
                      I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <div className="form-options">
                  <label className="newsletter-subscription">
                    <input type="checkbox" defaultChecked />
                    <span>Send me educational resources and updates</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className={`register-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i>
                      Create IDEAS Account
                    </>
                  )}
                </button>

                <div className="divider">
                  <span>Already have an account?</span>
                </div>

                <Link to="/login" className="login-link">
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In to Existing Account
                </Link>
              </form>

              <div className="register-footer">
                <p>By creating an account, you agree to our platform policies and educational guidelines.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
