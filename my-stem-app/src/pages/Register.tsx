import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import './Register.css';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { t, language, setLanguage, languageOptions } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Преводи за валидационни съобщения
    const validationMessages = {
      passwordMismatch: t('password_mismatch'),
      passwordTooShort: t('password_too_short'),
      passwordWeak: t('password_weak'),
      emailInUse: t('email_in_use'),
      invalidEmail: t('invalid_email')
    };

    if (password !== confirmPassword) {
      setError(validationMessages.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(validationMessages.passwordTooShort);
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
        language: language,
        theme: theme,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      // Преведено съобщение за успех
      const successMessage = language === 'bg' ? 'Регистрацията е успешна! Добре дошли в IDEAS.' :
                           language === 'es' ? '¡Registro exitoso! Bienvenido a IDEAS.' :
                           "Registration successful! Welcome to IDEAS.";
      alert(successMessage);
    } catch (err: any) {
      // Преведени грешки от Firebase
      let errorMessage = err.message;
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = validationMessages.emailInUse;
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = validationMessages.invalidEmail;
      } else if (err.code === 'auth/weak-password') {
        errorMessage = validationMessages.passwordWeak;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Функции за превод на динамични текстове
  const getPlaceholders = () => ({
    passwordPlaceholder: language === 'bg' ? 'Създайте парола (мин. 6 символа)' : 
                        language === 'es' ? 'Crea una contraseña (mín. 6 caracteres)' : 
                        'Create a password (min. 6 characters)',
    confirmPasswordLabel: language === 'bg' ? 'Потвърдете паролата' : 
                         language === 'es' ? 'Confirmar contraseña' : 
                         'Confirm Password',
    confirmPasswordPlaceholder: language === 'bg' ? 'Потвърдете паролата си' : 
                               language === 'es' ? 'Confirma tu contraseña' : 
                               'Confirm your password',
    termsText: language === 'bg' ? 'Съгласявам се с ' : 
               language === 'es' ? 'Acepto los ' : 
               'I agree to the ',
    termsAnd: language === 'bg' ? ' и ' : 
              language === 'es' ? ' y la ' : 
              ' and ',
    newsletterText: language === 'bg' ? 'Изпращайте ми образователни ресурси и актуализации' : 
                    language === 'es' ? 'Envíame recursos educativos y actualizaciones' : 
                    'Send me educational resources and updates',
    loadingText: language === 'bg' ? 'Създаване на акаунт...' : 
                 language === 'es' ? 'Creando cuenta...' : 
                 'Creating Account...',
    registerButtonText: language === 'bg' ? 'Създай акаунт в IDEAS' : 
                       language === 'es' ? 'Crear cuenta IDEAS' : 
                       'Create IDEAS Account',
    alreadyHaveAccount: language === 'bg' ? 'Вече имате акаунт?' : 
                        language === 'es' ? '¿Ya tienes una cuenta?' : 
                        'Already have an account?',
    signInText: language === 'bg' ? 'Вход в съществуващ акаунт' : 
                language === 'es' ? 'Iniciar sesión en cuenta existente' : 
                'Sign In to Existing Account',
    createAccountTitle: language === 'bg' ? 'Създайте своя акаунт' : 
                       language === 'es' ? 'Crea tu cuenta' : 
                       'Create Your Account',
    journeyTitle: language === 'bg' ? 'Започнете пътешествието си в STEM ученето днес' : 
                  language === 'es' ? 'Comienza tu viaje de aprendizaje STEM hoy' : 
                  'Start your STEM learning journey today',
    platformDescription: language === 'bg' ? 'Започнете пътешествието си в STEM образованието с изкуствен интелект и разгледайте света на логическото програмиране и изкуствения интелект.' : 
                        language === 'es' ? 'Comienza tu viaje en la educación STEM impulsada por IA y descubre el mundo de la programación lógica y la inteligencia artificial.' : 
                        'Start your journey in AI-powered STEM education and discover the world of logical programming and artificial intelligence.',
    joinText: language === 'bg' ? 'Присъединете се към' : 
              language === 'es' ? 'Únete a la' : 
              'Join the',
    interactiveTutorials: language === 'bg' ? 'Интерактивни уроци' : 
                         language === 'es' ? 'Tutoriales interactivos' : 
                         'Interactive tutorials',
    handsOnProjects: language === 'bg' ? 'Практически проекти' : 
                     language === 'es' ? 'Proyectos prácticos' : 
                     'Hands-on projects',
    collaborativeLearning: language === 'bg' ? 'Съвместно учене' : 
                           language === 'es' ? 'Aprendizaje colaborativo' : 
                           'Collaborative learning',
    progressTracking: language === 'bg' ? 'Проследяване на напредъка' : 
                      language === 'es' ? 'Seguimiento del progreso' : 
                      'Progress tracking',
    footerText: language === 'bg' ? 'Създавайки акаунт, вие се съгласявате с политиките на платформата и образователните насоки.' : 
                language === 'es' ? 'Al crear una cuenta, aceptas nuestras políticas de plataforma y directrices educativas.' : 
                'By creating an account, you agree to our platform policies and educational guidelines.'
  });

  const placeholders = getPlaceholders();

  return (
    <div className={`register-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        title={theme === 'dark' ? 
          (language === 'bg' ? 'Превключи към светла тема' : 
           language === 'es' ? 'Cambiar a tema claro' : 
           'Switch to light theme') : 
          (language === 'bg' ? 'Превключи към тъмна тема' : 
           language === 'es' ? 'Cambiar a tema oscuro' : 
           'Switch to dark theme')}
      >
        <i className={theme === 'dark' ? "fas fa-sun" : "fas fa-moon"}></i>
      </button>

      {/* Language Selector */}
      <div className="language-selector">
        <div className="language-dropdown">
          <button className="language-current">
            <span className="language-flag">{languageOptions.find(l => l.code === language)?.flag || '🇺🇸'}</span>
            <span className="language-label">{languageOptions.find(l => l.code === language)?.label || 'EN'}</span>
            <i className="fas fa-chevron-down"></i>
          </button>
          <div className="language-options">
            {languageOptions.map((option) => (
              <button
                key={option.code}
                className={`language-option ${language === option.code ? 'active' : ''}`}
                onClick={() => setLanguage(option.code)}
              >
                <span className="language-flag">{option.flag}</span>
                <span className="language-name">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

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
              <div className="logo-text-container">
                <span className="logo-text">IDEAS</span>
                <span className="logo-subtitle">{t('innovation_platform')}</span>
              </div>
            </div>

            <div className="brand-content">
              <h1 className="brand-title">
                {placeholders.joinText}
                <span className="title-gradient"> {t('innovation_platform')}</span>
              </h1>

              <p className="brand-description">
                {placeholders.platformDescription}
              </p>

              <div className="brand-features">
                <div className="brand-feature">
                  <i className="fas fa-graduation-cap"></i>
                  <span>{placeholders.interactiveTutorials}</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-code"></i>
                  <span>{placeholders.handsOnProjects}</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-users"></i>
                  <span>{placeholders.collaborativeLearning}</span>
                </div>
                <div className="brand-feature">
                  <i className="fas fa-chart-line"></i>
                  <span>{placeholders.progressTracking}</span>
                </div>
              </div>

              <div className="success-stats">
                <div className="success-stat">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">{t('students')}</div>
                </div>
                <div className="success-stat">
                  <div className="stat-number">200+</div>
                  <div className="stat-label">{t('projects')}</div>
                </div>
                <div className="success-stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">{t('schools')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="register-form-section">
            <div className="register-form-container">
              <div className="form-header">
                <h2 className="form-title">
                  {placeholders.createAccountTitle}
                </h2>
                <p className="form-subtitle">
                  {placeholders.journeyTitle}
                </p>
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
                    {t('email_address')}
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    placeholder={t('enter_email')} 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock"></i>
                    {t('password')}
                  </label>
                  <input 
                    type="password" 
                    id="password"
                    placeholder={placeholders.passwordPlaceholder}
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    <i className="fas fa-lock"></i>
                    {placeholders.confirmPasswordLabel}
                  </label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    placeholder={placeholders.confirmPasswordPlaceholder}
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
                      {placeholders.termsText}
                      <a href="#">{t('terms_of_service')}</a>
                      {placeholders.termsAnd}
                      <a href="#">{t('privacy_policy')}</a>
                    </span>
                  </label>
                </div>

                <div className="form-options">
                  <label className="newsletter-subscription">
                    <input type="checkbox" defaultChecked />
                    <span>
                      {placeholders.newsletterText}
                    </span>
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
                      {placeholders.loadingText}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i>
                      {placeholders.registerButtonText}
                    </>
                  )}
                </button>

                <div className="divider">
                  <span>{placeholders.alreadyHaveAccount}</span>
                </div>

                <Link to="/login" className="login-link">
                  <i className="fas fa-sign-in-alt"></i>
                  {placeholders.signInText}
                </Link>
              </form>

              <div className="register-footer">
                <p>{placeholders.footerText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}