import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './Home.module.css';

function AnimatedCodeDemo() {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, _setIsTyping] = useState(true);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const codeLines = [
    '% Define student knowledge base',
    'studies(alice, ai).',
    'studies(bob, robotics).',
    'studies(charlie, biology).',
    '',
    '% Query: Who studies AI?',
    '?- studies(Who, ai).',
    '% Result: Who = alice'
  ];

  useEffect(() => {
    if (isTyping && currentLine < codeLines.length) {
      const currentText = codeLines[currentLine];
      let charIndex = 0;
      
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }

      const typeLine = () => {
        if (charIndex <= currentText.length) {
          setDisplayedCode(prev => {
            const lines = prev.split('\n');
            lines[currentLine] = currentText.substring(0, charIndex);
            return lines.join('\n');
          });
          charIndex++;
          animationRef.current = setTimeout(typeLine, charIndex === 0 ? 500 : Math.random() * 50 + 30);
        } else {
          setTimeout(() => {
            setCurrentLine(prev => prev + 1);
          }, 200);
        }
      };

      typeLine();
    } else if (currentLine >= codeLines.length) {
      setTimeout(() => {
        setDisplayedCode('');
        setCurrentLine(0);
      }, 3000);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [currentLine, isTyping]);

  const renderCodeWithSyntaxHighlighting = () => {
    return displayedCode.split('\n').map((line, index) => {
      let formattedLine = line;
      
      if (line.startsWith('%')) {
        formattedLine = `<span class="${styles.codeComment}">${line}</span>`;
      }
      else if (line.includes('studies(')) {
        formattedLine = line
          .replace(/studies/g, `<span class="${styles.codeKeyword}">studies</span>`)
          .replace(/(alice|bob|charlie)/g, `<span class="${styles.codeString}">$1</span>`)
          .replace(/(ai|robotics|biology)/g, `<span class="${styles.codeVariable}">$1</span>`);
      }
      else if (line.startsWith('?-')) {
        formattedLine = line
          .replace(/\?-/g, `<span class="${styles.codeQuery}">?-</span>`)
          .replace(/studies/g, `<span class="${styles.codeKeyword}">studies</span>`)
          .replace(/Who/g, `<span class="${styles.codeVariable}">Who</span>`)
          .replace(/ai/g, `<span className="${styles.codeString}">ai</span>`);
      }
      else if (line.startsWith('% Result:')) {
        formattedLine = `<span class="${styles.codeOutput}">${line}</span>`;
      }
      else if (line === '') {
        formattedLine = '&nbsp;';
      }

      return (
        <div key={index} className={styles.codeLine}>
          <span className={styles.lineNumber}>{index + 1}</span>
          <span 
            className={styles.codeContent}
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
          {index === currentLine - 1 && isTyping && (
            <span className={styles.typingCursor}>|</span>
          )}
        </div>
      );
    });
  };

  return (
    <div className={styles.demoVisualContent}>
      <div className={styles.demoShowcase}>
        <div className={styles.showcaseWindow}>
          <div className={styles.showcaseHeader}>
            <div className={styles.showcaseControls}>
              <div className={`${styles.showcaseControl} ${styles.red}`}></div>
              <div className={`${styles.showcaseControl} ${styles.yellow}`}></div>
              <div className={`${styles.showcaseControl} ${styles.green}`}></div>
            </div>
            <div className={styles.showcaseTitle}>IDEAS Platform - Live Demo</div>
          </div>
          
          <div className={styles.showcaseBody}>
            <div className={styles.codePreview}>
              <div className={styles.codeTabs}>
                <div className={`${styles.codeTab} ${styles.active}`}>student.pl</div>
                <div className={styles.codeTab}>query.pl</div>
                <div className={styles.codeTab}>results.pl</div>
              </div>
              
              <div className={styles.codeArea}>
                {renderCodeWithSyntaxHighlighting()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`${styles.homePage} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      {/* Hero Section - Gamma.app Style */}
      <section className={styles.gammaHero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
          <div className={styles.floatingShapes}>
            <div className={`${styles.shape} ${styles.shape1}`}></div>
            <div className={`${styles.shape} ${styles.shape2}`}></div>
            <div className={`${styles.shape} ${styles.shape3}`}></div>
            <div className={`${styles.shape} ${styles.shape4}`}></div>
          </div>
        </div>
        
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            {/* Left Side - Text Content */}
            <div className={styles.heroText}>
              
              <p className={styles.heroAcronym}>
                IDEAS - {t('ideas_acronym') || 'Intelligent Data Educational Analysis System'}
              </p>
              
              {/* Main Title */}
              <h1 className={styles.heroTitle}>
                {t('hero_title_part1') || 'Transform STEM Education'}
                <span className={styles.titleGradient}> {t('hero_title_part2') || 'with AI-Powered Learning'}</span>
              </h1>

              {/* Description */}
              <p className={styles.heroDescription}>
                {t('hero_description') || 'Empower students with logical programming and artificial intelligence concepts through interactive, hands-on STEM projects.'}
              </p>

              {/* CTA Buttons */}
              <div className={styles.heroActions}>
                <Link to="/register" className={`${styles.ctaButton} ${styles.primary}`}>
                  <span>{t('get_started_free') || 'Get Started Free'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <a 
                  href="https://prolog-chat-app.vercel.app/chat" 
                  className={`${styles.ctaButton} ${styles.secondary}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t('view_demos') || 'View Demos'}
                </a>
              </div>

              {/* Trust Indicators */}
              <div className={styles.trustSection}>
                <div className={styles.trustStats}>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>50+</div>
                    <div className={styles.statLabel}>{t('schools') || 'Schools'}</div>
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>10K+</div>
                    <div className={styles.statLabel}>{t('students') || 'Students'}</div>
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>200+</div>
                    <div className={styles.statLabel}>{t('projects') || 'Projects'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Animated Graphics */}
            <div className={styles.heroVisual}>
              <div className={styles.floatingGraphics}>
                <img src="/images/1.png" alt="AI Education" className={`${styles.floatingImg} ${styles.img1}`} />
                <img src="/images/2.png" alt="STEM Learning" className={`${styles.floatingImg} ${styles.img2}`} />
                <img src="/images/3.png" alt="Coding Platform" className={`${styles.floatingImg} ${styles.img3}`} />
                <img src="/images/4.png" alt="Robotics" className={`${styles.floatingImg} ${styles.img4}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Gamma Style */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {t('features_title_part1') || 'Everything you need to teach'}
              <span className={styles.titleGradient}> {t('features_title_part2') || 'AI and Logic Programming'}</span>
            </h2>
            <p className={styles.sectionDescription}>
              {t('features_description') || 'Comprehensive tools and resources designed specifically for STEM education'}
            </p>
          </div>

          <div className={styles.gammaFeaturesGrid}>
            <div className={styles.gammaFeatureCard}>
              <div className={styles.cardContent}>
                <div className={styles.featureIcon}>
                  <img src="/images/01.png" alt="AI Learning" className={styles.featureImage} />
                </div>
                <h3>{t('feature1_title') || 'AI-Powered Learning'}</h3>
                <p>{t('feature1_description') || 'Interactive tutorials and intelligent feedback systems that adapt to each student\'s learning pace.'}</p>
                <a href="#" className={styles.featureLink}>
                  <span>{t('explore_tools') || 'Explore AI Tools'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.gammaFeatureCard}>
              <div className={styles.cardContent}>
                <div className={styles.featureIcon}>
                  <img src="/images/02.png" alt="Collaboration" className={styles.featureImage} />
                </div>
                <h3>{t('feature2_title') || 'Real-time Collaboration'}</h3>
                <p>{t('feature2_description') || 'Students work together on projects with live editing and instant feedback.'}</p>
                <a href="#" className={styles.featureLink}>
                  <span>{t('start_collaborating') || 'Start Collaborating'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.gammaFeatureCard}>
              <div className={styles.cardContent}>
                <div className={styles.featureIcon}>
                  <img src="/images/03.png" alt="Projects" className={styles.featureImage} />
                </div>
                <h3>{t('feature3_title') || 'Hands-on Projects'}</h3>
                <p>{t('feature3_description') || 'Practical STEM projects that apply logical programming to real-world problems.'}</p>
                <a href="#" className={styles.featureLink}>
                  <span>{t('view_projects') || 'View Projects'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.gammaFeatureCard}>
              <div className={styles.cardContent}>
                <div className={styles.featureIcon}>
                  <img src="/images/04.png" alt="Analytics" className={styles.featureImage} />
                </div>
                <h3>{t('feature4_title') || 'Progress Analytics'}</h3>
                <p>{t('feature4_description') || 'Detailed insights into student performance and learning patterns.'}</p>
                <a href="#" className={styles.featureLink}>
                  <span>{t('see_analytics') || 'See Analytics'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.gammaFeatureCard}>
              <div className={styles.cardContent}>
                <div className={styles.featureIcon}>
                  <img src="/images/01.png" alt="Curriculum" className={styles.featureImage} />
                </div>
                <h3>{t('feature5_title') || 'Curriculum Integration'}</h3>
                <p>{t('feature5_description') || 'Seamlessly fits into existing STEM curricula with ready-to-use lesson plans.'}</p>
                <a href="#" className={styles.featureLink}>
                  <span>{t('browse_curriculum') || 'Browse Curriculum'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.gammaFeatureCard}>
              <div className={styles.cardContent}>
                <div className={styles.featureIcon}>
                  <img src="/images/02.png" alt="Industry Skills" className={styles.featureImage} />
                </div>
                <h3>{t('feature6_title') || 'Industry Ready Skills'}</h3>
                <p>{t('feature6_description') || 'Prepares students for careers in AI, data science, and technology.'}</p>
                <a href="#" className={styles.featureLink}>
                  <span>{t('learn_skills') || 'Learn Skills'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section - Modern Design */}
      <section className={styles.demoSection}>
        <div className={styles.demoContainer}>
          <div className={styles.demoBackground}>
            <div className={styles.demoGradient}></div>
            <div className={styles.demoShapes}>
              <div className={`${styles.demoShape} ${styles.demoShape1}`}></div>
              <div className={`${styles.demoShape} ${styles.demoShape2}`}></div>
              <div className={`${styles.demoShape} ${styles.demoShape3}`}></div>
            </div>
          </div>
          
          <div className={styles.demoContentWrapper}>
            <div className={styles.demoTextContent}>
              
              <h2 className={styles.demoTitle}>
                {t('demo_title_part1') || 'See IDEAS'}
                <span className={styles.demoTitleGradient}> {t('demo_title_part2') || 'in Action'}</span>
              </h2>

              <p className={styles.demoDescription}>
                {t('demo_description') || 'Experience how our platform transforms complex programming concepts into engaging, interactive learning experiences that students love.'}
              </p>

              <div className={styles.demoFeaturesGrid}>
                <div className={styles.demoFeature}>
                  <div className={styles.demoFeatureIcon}>🎨</div>
                  <div className={styles.demoFeatureText}>
                    <h4>{t('demo_feature1_title') || 'Visual Programming Interface'}</h4>
                    <p>{t('demo_feature1_description') || 'Drag-and-drop logic blocks for intuitive learning'}</p>
                  </div>
                </div>

                <div className={styles.demoFeature}>
                  <div className={styles.demoFeatureIcon}>⚡</div>
                  <div className={styles.demoFeatureText}>
                    <h4>{t('demo_feature2_title') || 'Real-time Code Execution'}</h4>
                    <p>{t('demo_feature2_description') || 'See results instantly as you write Prolog code'}</p>
                  </div>
                </div>

                <div className={styles.demoFeature}>
                  <div className={styles.demoFeatureIcon}>👨‍🏫</div>
                  <div className={styles.demoFeatureText}>
                    <h4>{t('demo_feature3_title') || 'Interactive Tutorials'}</h4>
                    <p>{t('demo_feature3_description') || 'Step-by-step guided learning experiences'}</p>
                  </div>
                </div>

                <div className={styles.demoFeature}>
                  <div className={styles.demoFeatureIcon}>🤝</div>
                  <div className={styles.demoFeatureText}>
                    <h4>{t('demo_feature4_title') || 'Collaborative Workspace'}</h4>
                    <p>{t('demo_feature4_description') || 'Work together with classmates in real-time'}</p>
                  </div>
                </div>
              </div>

              <div className={styles.demoActions}>
                <Link to="/topics" className={`${styles.demoButton} ${styles.primary}`}>
                  <span>{t('explore_live_demos') || 'Explore Live Demos'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link to="/register" className={`${styles.demoButton} ${styles.secondary}`}>
                  {t('try_free_tutorial') || 'Try Free Tutorial'}
                </Link>
              </div>
            </div>

            {/* Заменен статичния код с анимирания компонент */}
            <AnimatedCodeDemo />
          </div>
        </div>
      </section>
    </div>
  );
}