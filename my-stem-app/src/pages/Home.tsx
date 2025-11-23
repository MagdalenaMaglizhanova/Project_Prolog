import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section - Gamma.app Style */}
      <section className="gamma-hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            {/* Left Side - Text Content */}
            <div className="hero-text">
              
              <p className="hero-acronym">
  IDEAS - Intelligent Data Educational Analysis System
</p>
              
              {/* Main Title */}
              <h1 className="hero-title">
                Transform STEM Education
                <span className="title-gradient"> with AI-Powered Learning</span>
              </h1>

              {/* Description */}
              <p className="hero-description">
                Empower students with logical programming and artificial intelligence concepts 
                through interactive, hands-on STEM projects.
              </p>

              {/* CTA Buttons */}
              <div className="hero-actions">
                <Link to="/register" className="cta-button primary">
                  <span>Get Started Free</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                  <a 
                  href="https://prolog-chat-app.vercel.app/chat" 
                  className="cta-button secondary"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Demos
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="trust-section">
                <div className="trust-stats">
                  <div className="stat">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Schools</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Students</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat">
                    <div className="stat-number">200+</div>
                    <div className="stat-label">Projects</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Animated Graphics */}
            <div className="hero-visual">
              <div className="floating-graphics">
                <img src="/src/images/1.png" alt="AI Education" className="floating-img img-1" />
                <img src="/src/images/2.png" alt="STEM Learning" className="floating-img img-2" />
                <img src="/src/images/3.png" alt="Coding Platform" className="floating-img img-3" />
                <img src="/src/images/4.png" alt="Robotics" className="floating-img img-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Features Section - Gamma Style */}
<section className="features-section">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">
        Everything you need to teach
        <span className="title-gradient"> AI and Logic Programming</span>
      </h2>
      <p className="section-description">
        Comprehensive tools and resources designed specifically for STEM education
      </p>
    </div>

    <div className="gamma-features-grid">
      <div className="gamma-feature-card">
        {/* ПРЕМАХНАТ card-background */}
        <div className="card-content">
          <div className="feature-icon">
            <img src="/src/images/01.png" alt="AI Learning" className="feature-image" />
          </div>
          <h3>AI-Powered Learning</h3>
          <p>Interactive tutorials and intelligent feedback systems that adapt to each student's learning pace.</p>
          <div className="feature-link">
            <span>Explore AI Tools</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="gamma-feature-card">
        <div className="card-content">
          <div className="feature-icon">
            <img src="/src/images/02.png" alt="Collaboration" className="feature-image" />
          </div>
          <h3>Real-time Collaboration</h3>
          <p>Students work together on projects with live editing and instant feedback.</p>
          <div className="feature-link">
            <span>Start Collaborating</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="gamma-feature-card">
        <div className="card-content">
          <div className="feature-icon">
            <img src="/src/images/03.png" alt="Projects" className="feature-image" />
          </div>
          <h3>Hands-on Projects</h3>
          <p>Practical STEM projects that apply logical programming to real-world problems.</p>
          <div className="feature-link">
            <span>View Projects</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="gamma-feature-card">
        <div className="card-content">
          <div className="feature-icon">
            <img src="/src/images/04.png" alt="Analytics" className="feature-image" />
          </div>
          <h3>Progress Analytics</h3>
          <p>Detailed insights into student performance and learning patterns.</p>
          <div className="feature-link">
            <span>See Analytics</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="gamma-feature-card">
        <div className="card-content">
          <div className="feature-icon">
            <img src="/src/images/01.png" alt="Curriculum" className="feature-image" />
          </div>
          <h3>Curriculum Integration</h3>
          <p>Seamlessly fits into existing STEM curricula with ready-to-use lesson plans.</p>
          <div className="feature-link">
            <span>Browse Curriculum</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="gamma-feature-card">
        <div className="card-content">
          <div className="feature-icon">
            <img src="/src/images/02.png" alt="Industry Skills" className="feature-image" />
          </div>
          <h3>Industry Ready Skills</h3>
          <p>Prepares students for careers in AI, data science, and technology.</p>
          <div className="feature-link">
            <span>Learn Skills</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

     {/* Demo Section - Modern Design */}
<section className="demo-section">
  <div className="demo-container">
    <div className="demo-background">
      <div className="demo-gradient"></div>
      <div className="demo-shapes">
        <div className="demo-shape demo-shape-1"></div>
        <div className="demo-shape demo-shape-2"></div>
        <div className="demo-shape demo-shape-3"></div>
      </div>
    </div>
    
    <div className="demo-content-wrapper">
      <div className="demo-text-content">
        <div className="demo-badge">
          <span>Live Preview</span>
        </div>
        
        <h2 className="demo-title">
          See IDEAS
          <span className="demo-title-gradient"> in Action</span>
        </h2>

        <p className="demo-description">
          Experience how our platform transforms complex programming concepts into 
          engaging, interactive learning experiences that students love.
        </p>

        <div className="demo-features-grid">
          <div className="demo-feature">
            <div className="demo-feature-icon">🎨</div>
            <div className="demo-feature-text">
              <h4>Visual Programming Interface</h4>
              <p>Drag-and-drop logic blocks for intuitive learning</p>
            </div>
          </div>

          <div className="demo-feature">
            <div className="demo-feature-icon">⚡</div>
            <div className="demo-feature-text">
              <h4>Real-time Code Execution</h4>
              <p>See results instantly as you write Prolog code</p>
            </div>
          </div>

          <div className="demo-feature">
            <div className="demo-feature-icon">👨‍🏫</div>
            <div className="demo-feature-text">
              <h4>Interactive Tutorials</h4>
              <p>Step-by-step guided learning experiences</p>
            </div>
          </div>

          <div className="demo-feature">
            <div className="demo-feature-icon">🤝</div>
            <div className="demo-feature-text">
              <h4>Collaborative Workspace</h4>
              <p>Work together with classmates in real-time</p>
            </div>
          </div>
        </div>

        <div className="demo-actions">
          <Link to="/topics" className="demo-button primary">
            <span>Explore Live Demos</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/register" className="demo-button secondary">
            Try Free Tutorial
          </Link>
        </div>
      </div>

      <div className="demo-visual-content">
        <div className="demo-showcase">
          <div className="showcase-window">
            <div className="showcase-header">
              <div className="showcase-controls">
                <div className="showcase-control red"></div>
                <div className="showcase-control yellow"></div>
                <div className="showcase-control green"></div>
              </div>
              <div className="showcase-title">IDEAS Platform - Live Demo</div>
            </div>
            
            <div className="showcase-body">
              <div className="code-preview">
                <div className="code-tabs">
                  <div className="code-tab active">student.pl</div>
                  <div className="code-tab">query.pl</div>
                  <div className="code-tab">results.pl</div>
                </div>
                
                <div className="code-area">
                  <div className="code-line">
                    <span className="line-number">1</span>
                    <span className="code-comment">% Define student knowledge base</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">2</span>
                    <span className="code-keyword">studies</span>(<span className="code-string">alice</span>, <span className="code-variable">ai</span>).
                  </div>
                  <div className="code-line">
                    <span className="line-number">3</span>
                    <span className="code-keyword">studies</span>(<span className="code-string">bob</span>, <span className="code-variable">robotics</span>).
                  </div>
                  <div className="code-line">
                    <span className="line-number">4</span>
                    <span className="code-keyword">studies</span>(<span className="code-string">charlie</span>, <span className="code-variable">biology</span>).
                  </div>
                  <div className="code-line">
                    <span className="line-number">5</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">6</span>
                    <span className="code-comment">% Query: Who studies AI?</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">7</span>
                    <span className="code-keyword">?- studies</span>(<span className="code-variable">Who</span>, <span className="code-variable">ai</span>).
                  </div>
                  <div className="code-line">
                    <span className="line-number">8</span>
                    <span className="code-output">% Result: Who = alice</span>
                  </div>
                </div>
              </div>
              
              <div className="demo-stats">
                <div className="demo-stat">
                  <div className="stat-value">95%</div>
                  <div className="stat-label">Student Engagement</div>
                </div>
                <div className="demo-stat">
                  <div className="stat-value">2x</div>
                  <div className="stat-label">Faster Learning</div>
                </div>
                <div className="demo-stat">
                  <div className="stat-value">100+</div>
                  <div className="stat-label">Active Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}