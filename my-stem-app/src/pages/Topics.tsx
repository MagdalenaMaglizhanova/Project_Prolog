import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import styles from "./Topics.module.css";

interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: string;
  color: string;
  lessonsCount: number;
  duration: string;
  completed: boolean;
}

interface Lesson {
  id: string;
  topicId: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  type: "video" | "article" | "exercise" | "quiz";
}

export default function Topics() {
  const { category } = useParams<{ category?: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"topics" | "lessons">("topics");

  const categories = [
    { id: "prolog", name: "Prolog Programming", icon: "fas fa-code", color: "#667eea" },
    { id: "ai", name: "Artificial Intelligence", icon: "fas fa-brain", color: "#FF6B8B" },
    { id: "databases", name: "Databases", icon: "fas fa-database", color: "#36D1DC" },
    { id: "algorithms", name: "Algorithms", icon: "fas fa-project-diagram", color: "#FFD166" },
    { id: "logic", name: "Logic Programming", icon: "fas fa-sitemap", color: "#9D4EDD" },
  ];

  // Зареждане на теми от базата данни
  useEffect(() => {
    async function loadTopics() {
      setIsLoading(true);
      try {
        let q;
        if (category) {
          q = query(collection(db, "topics"), where("category", "==", category));
        } else {
          q = collection(db, "topics");
        }

        const snapshot = await getDocs(q);
        const topicsData: Topic[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Topic));
        
        setTopics(topicsData);
        
        // Ако има категория, задаваме първата тема като избрана
        if (category && topicsData.length > 0) {
          setSelectedTopic(topicsData[0]);
        }
      } catch (err) {
        console.error("Failed to load topics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTopics();
  }, [category]);

  // Зареждане на уроци за избраната тема
  useEffect(() => {
    async function loadLessons() {
      if (!selectedTopic) return;

      try {
        const q = query(collection(db, "lessons"), where("topicId", "==", selectedTopic.id));
        const snapshot = await getDocs(q);
        const lessonsData: Lesson[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Lesson));
        
        setLessons(lessonsData);
      } catch (err) {
        console.error("Failed to load lessons:", err);
      }
    }
    loadLessons();
  }, [selectedTopic]);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setActiveTab("lessons");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "#10b981";
      case "intermediate": return "#f59e0b";
      case "advanced": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return "fas fa-play-circle";
      case "article": return "fas fa-file-alt";
      case "exercise": return "fas fa-code";
      case "quiz": return "fas fa-question-circle";
      default: return "fas fa-circle";
    }
  };

  return (
    <div className={styles.topicsContainer}>
      {/* 🔹 САЙДБАР С КАТЕГОРИИ */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h2><i className="fas fa-graduation-cap"></i> Learning Topics</h2>
            <p className={styles.sidebarSubtitle}>Explore educational materials</p>
          </div>

          <div className={styles.categoriesSection}>
            <h3 className={styles.sectionTitle}>
              <i className="fas fa-layer-group"></i> Categories
            </h3>
            <div className={styles.categoriesList}>
              <Link 
                to="/topics" 
                className={`${styles.categoryItem} ${!category ? styles.active : ''}`}
              >
                <div className={styles.categoryIcon}>
                  <i className="fas fa-th-large"></i>
                </div>
                <span>All Topics</span>
              </Link>
              
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/topics/${cat.id}`}
                  className={`${styles.categoryItem} ${category === cat.id ? styles.active : ''}`}
                  style={{ '--category-color': cat.color } as React.CSSProperties}
                >
                  <div className={styles.categoryIcon} style={{ backgroundColor: cat.color }}>
                    <i className={cat.icon}></i>
                  </div>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.progressSection}>
            <h3 className={styles.sectionTitle}>
              <i className="fas fa-chart-line"></i> Learning Progress
            </h3>
            <div className={styles.progressStats}>
              <div className={styles.progressStat}>
                <div className={styles.progressNumber}>
                  {topics.filter(t => t.completed).length}/{topics.length}
                </div>
                <div className={styles.progressLabel}>Topics Completed</div>
              </div>
              <div className={styles.progressStat}>
                <div className={styles.progressNumber}>
                  {lessons.filter(l => l.completed).length}/{lessons.length}
                </div>
                <div className={styles.progressLabel}>Lessons Completed</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 🔹 ОСНОВНО СЪДЪРЖАНИЕ */}
      <main className={styles.mainContent}>
        {/* Хедър */}
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>
              <i className="fas fa-book-open"></i>
              {category 
                ? categories.find(c => c.id === category)?.name || "Topics"
                : "All Learning Topics"}
              <span className={styles.titleHighlight}>
                {selectedTopic ? ` | ${selectedTopic.title}` : ''}
              </span>
            </h1>
            
            <div className={styles.headerActions}>
              <div className={styles.searchBar}>
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search topics..." />
              </div>
              <button className={styles.filterButton}>
                <i className="fas fa-filter"></i>
                Filter
              </button>
            </div>
          </div>

          {/* Табове */}
          <div className={styles.tabNavigation}>
            <button
              className={`${styles.tabButton} ${activeTab === "topics" ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab("topics")}
            >
              <i className="fas fa-th-large"></i>
              All Topics ({topics.length})
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "lessons" ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab("lessons")}
              disabled={!selectedTopic}
            >
              <i className="fas fa-list-ul"></i>
              Lessons {selectedTopic && `(${lessons.length})`}
            </button>
          </div>
        </div>

        {/* Съдържание */}
        <div className={styles.content}>
          {/* ТАБ С ТЕМИ */}
          {activeTab === "topics" && (
            <div className={styles.topicsGrid}>
              {isLoading ? (
                <div className={styles.loadingState}>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Loading topics...</span>
                </div>
              ) : topics.length === 0 ? (
                <div className={styles.emptyState}>
                  <i className="fas fa-book"></i>
                  <h3>No topics found</h3>
                  <p>There are no topics available for this category yet.</p>
                </div>
              ) : (
                topics.map(topic => (
                  <div 
                    key={topic.id} 
                    className={`${styles.topicCard} ${selectedTopic?.id === topic.id ? styles.topicCardActive : ''}`}
                    onClick={() => handleTopicSelect(topic)}
                    style={{ '--topic-color': topic.color } as React.CSSProperties}
                  >
                    <div className={styles.topicHeader}>
                      <div 
                        className={styles.topicIcon}
                        style={{ backgroundColor: topic.color }}
                      >
                        <i className={topic.icon}></i>
                      </div>
                      <div className={styles.topicBadges}>
                        <span 
                          className={styles.difficultyBadge}
                          style={{ backgroundColor: getDifficultyColor(topic.difficulty) }}
                        >
                          {topic.difficulty}
                        </span>
                        {topic.completed && (
                          <span className={styles.completedBadge}>
                            <i className="fas fa-check"></i>
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.topicBody}>
                      <h3 className={styles.topicTitle}>{topic.title}</h3>
                      <p className={styles.topicDescription}>{topic.description}</p>
                      
                      <div className={styles.topicMeta}>
                        <div className={styles.metaItem}>
                          <i className="fas fa-book"></i>
                          <span>{topic.lessonsCount} lessons</span>
                        </div>
                        <div className={styles.metaItem}>
                          <i className="fas fa-clock"></i>
                          <span>{topic.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.topicFooter}>
                      <button className={styles.startButton}>
                        {topic.completed ? "Review" : "Start Learning"}
                        <i className="fas fa-arrow-right"></i>
                      </button>
                      <Link 
                        to={`/chat?topic=${topic.id}`}
                        className={styles.chatButton}
                        title="Ask AI about this topic"
                      >
                        <i className="fas fa-robot"></i>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ТАБ С УРОЦИ */}
          {activeTab === "lessons" && (
            <div className={styles.lessonsSection}>
              {!selectedTopic ? (
                <div className={styles.selectTopicPrompt}>
                  <i className="fas fa-hand-pointer"></i>
                  <h3>Select a topic to view lessons</h3>
                  <p>Choose a topic from the list to see available lessons</p>
                </div>
              ) : isLoading ? (
                <div className={styles.loadingState}>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Loading lessons...</span>
                </div>
              ) : (
                <>
                  {/* Информация за избраната тема */}
                  <div className={styles.selectedTopicInfo}>
                    <div 
                      className={styles.topicIconLarge}
                      style={{ backgroundColor: selectedTopic.color }}
                    >
                      <i className={selectedTopic.icon}></i>
                    </div>
                    <div className={styles.topicInfoContent}>
                      <h2>{selectedTopic.title}</h2>
                      <p>{selectedTopic.description}</p>
                      <div className={styles.topicStats}>
                        <div className={styles.stat}>
                          <i className="fas fa-graduation-cap"></i>
                          <span>Difficulty: <strong>{selectedTopic.difficulty}</strong></span>
                        </div>
                        <div className={styles.stat}>
                          <i className="fas fa-book"></i>
                          <span>Lessons: <strong>{selectedTopic.lessonsCount}</strong></span>
                        </div>
                        <div className={styles.stat}>
                          <i className="fas fa-clock"></i>
                          <span>Duration: <strong>{selectedTopic.duration}</strong></span>
                        </div>
                      </div>
                    </div>
                    <button className={styles.startCourseButton}>
                      <i className="fas fa-play"></i>
                      Start Course
                    </button>
                  </div>

                  {/* Списък с уроци */}
                  <div className={styles.lessonsList}>
                    <h3 className={styles.lessonsTitle}>
                      <i className="fas fa-list-ol"></i>
                      Course Lessons
                    </h3>
                    
                    {lessons.length === 0 ? (
                      <div className={styles.emptyLessons}>
                        <i className="fas fa-file-alt"></i>
                        <p>No lessons available for this topic yet.</p>
                      </div>
                    ) : (
                      lessons.map((lesson, index) => (
                        <div 
                          key={lesson.id} 
                          className={`${styles.lessonItem} ${lesson.completed ? styles.lessonCompleted : ''}`}
                        >
                          <div className={styles.lessonNumber}>{index + 1}</div>
                          
                          <div className={styles.lessonIcon}>
                            <i className={getTypeIcon(lesson.type)}></i>
                          </div>
                          
                          <div className={styles.lessonContent}>
                            <div className={styles.lessonHeader}>
                              <h4>{lesson.title}</h4>
                              <span className={styles.lessonDuration}>
                                <i className="fas fa-clock"></i>
                                {lesson.duration}
                              </span>
                            </div>
                            <p className={styles.lessonDescription}>{lesson.description}</p>
                            
                            <div className={styles.lessonActions}>
                              <button className={styles.lessonButton}>
                                {lesson.completed ? "Review" : "Start Lesson"}
                              </button>
                              {lesson.completed && (
                                <span className={styles.completedLabel}>
                                  <i className="fas fa-check-circle"></i>
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}