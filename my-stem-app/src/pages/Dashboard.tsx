import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { supabase } from "../services/supabase";
import styles from "./Dashboard.module.css";

const folders = ["animals", "geography", "history", "mineralwater"];

const courses = [
  { id: 1, title: "UI Design", description: "Learn design basics", progress: 70, color: "#FF6B8B", icon: "fas fa-palette" },
  { id: 2, title: "Programming", description: "Prolog fundamentals", progress: 45, color: "#36D1DC", icon: "fas fa-code" },
  { id: 3, title: "Algorithms", description: "Advanced logic", progress: 85, color: "#FFD166", icon: "fas fa-brain" },
  { id: 4, title: "Data Structures", description: "Master Prolog structures", progress: 30, color: "#9D4EDD", icon: "fas fa-project-diagram" },
  { id: 5, title: "Database Systems", description: "SQL and Prolog integration", progress: 60, color: "#4CC9F0", icon: "fas fa-database" },
  { id: 6, title: "AI & ML", description: "Artificial Intelligence basics", progress: 25, color: "#FF9E6D", icon: "fas fa-robot" },
];

const assignments = [
  {
    id: 1,
    title: "UI Design Principles",
    description: "Master color theory, typography, and layout fundamentals",
    backgroundImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Design",
    status: "In Progress",
    statusIcon: "fas fa-spinner",
    progress: 72,
    dueDate: "2 days",
    actionText: "Continue"
  },
  {
    id: 2,
    title: "Prolog Fundamentals",
    description: "Learn basic syntax, facts, rules, and queries in Prolog",
    backgroundImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Programming",
    status: "Not Started",
    statusIcon: "far fa-clock",
    progress: 0,
    dueDate: "1 week",
    actionText: "Start"
  },
  {
    id: 3,
    title: "Search Algorithms",
    description: "Implement DFS, BFS, and A* algorithms in Prolog",
    backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Algorithms",
    status: "Completed",
    statusIcon: "fas fa-check-circle",
    progress: 100,
    dueDate: "Past due",
    actionText: "Review"
  },
  {
    id: 4,
    title: "Data Structures",
    description: "Work with lists, trees, and graphs in Prolog",
    backgroundImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Data Science",
    status: "In Progress",
    statusIcon: "fas fa-spinner",
    progress: 45,
    dueDate: "3 days",
    actionText: "Continue"
  },
  {
    id: 5,
    title: "Database Integration",
    description: "Connect Prolog with SQL databases",
    backgroundImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Database",
    status: "In Progress",
    statusIcon: "fas fa-spinner",
    progress: 88,
    dueDate: "5 days",
    actionText: "Continue"
  },
  {
    id: 6,
    title: "AI Project",
    description: "Build a simple expert system in Prolog",
    backgroundImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "AI",
    status: "Not Started",
    statusIcon: "far fa-clock",
    progress: 0,
    dueDate: "2 weeks",
    actionText: "Start"
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState(folders[0]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [submissions, setSubmissions] = useState<
    { id: string; name: string; date: string; status: string; code?: string }[]
  >([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "prologCodes"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().title,
        date: new Date(doc.data().createdAt?.toMillis()).toLocaleString(),
        status: doc.data().status ?? "success",
        code: doc.data().code
      }));

      setSubmissions(data);
    });

    return () => unsub();
  }, [user]);

  const handleUpload = async () => {
    if (!code.trim() || !user) return;

    await addDoc(collection(db, "prologCodes"), {
      userId: user.uid,
      title: `Prolog Submission ${submissions.length + 1}`,
      code: code,
      status: Math.random() > 0.3 ? "success" : "error",
      createdAt: serverTimestamp()
    });

    setCode("");
    setUploadStatus("✅ " + (t('upload_success') || "Code uploaded successfully!"));
  };

  const handleFileUpload = async () => {
    if (!file || !user) {
      console.error("❌ No file or user:", { file, user });
      setUploadStatus("❌ " + (t('no_file_user') || "No file selected or user not logged in"));
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pl')) {
      console.error("❌ Not a .pl file:", file.name);
      setUploadStatus("❌ " + (t('only_pl_files') || "Only .pl files allowed"));
      return;
    }

    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${user.uid}_${timestamp}_${safeFileName}`;

    try {
      const { data: uploadData, error } = await supabase.storage
        .from("prolog-files")
        .upload(path, file, { 
          upsert: true,
          cacheControl: '3600',
          contentType: file.type || 'text/plain'
        });

      if (error) {
        console.error("❌ Supabase upload error:", error);
        setUploadStatus("❌ " + (t('upload_failed') || "Upload failed:") + " " + error.message);
        return;
      }

      await addDoc(collection(db, "prologCodes"), {
        userId: user.uid,
        title: `File: ${file.name}`,
        code: `Uploaded file to ${path}`,
        fileName: file.name,
        filePath: path,
        folder: folder,
        fileSize: file.size,
        status: "success",
        createdAt: serverTimestamp()
      });
console.log(uploadData);
      setUploadStatus("✅ " + (t('file_upload_success') || "File uploaded successfully!"));
      setFile(null);
      
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error("❌ Catch block error:", err);
      setUploadStatus("❌ " + (t('unexpected_error') || "An unexpected error occurred"));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.toLowerCase().endsWith('.pl')) {
      setFile(droppedFile);
    } else {
      setUploadStatus("❌ " + (t('only_pl_files') || "Only .pl files allowed"));
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success": return t('status_success') || "Success";
      case "error": return t('status_error') || "Error";
      default: return t('status_pending') || "Pending";
    }
  };

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const successfulSubmissions = submissions.filter(s => s.status === "success").length;
  const fileUploads = submissions.filter(s => s.name.includes("File:")).length;
  const successRate = totalSubmissions > 0 ? Math.round((successfulSubmissions / totalSubmissions) * 100) : 0;

  // Stats for progress tab
  const completedAssignments = assignments.filter(a => a.status === "Completed").length;
  const inProgressAssignments = assignments.filter(a => a.status === "In Progress").length;
  const totalAssignments = assignments.length;
  const completionRate = Math.round((completedAssignments / totalAssignments) * 100);
console.log(inProgressAssignments);
  return (
    <div className={`${styles.dashboard} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      
      {/* 🔹 ЛЯВО – Sidebar (навигация) */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <i className="fas fa-lightbulb"></i>
            <div>
              <span className={styles.logoText}>IDEAS</span>
              <span className={styles.logoSubtitle}>{t('learning_platform') || "Learning Platform"}</span>
            </div>
          </div>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <i className="fas fa-user-graduate"></i>
          </div>
          <h3 className={styles.userName}>
            {user?.email?.split('@')[0] || "Student"}
          </h3>
          <div className={styles.userEmail}>
            <i className="fas fa-envelope"></i>
            {user?.email || "student@prolog.edu"}
          </div>
        </div>
        
        <nav className={styles.navigation}>
          <button
            className={`${styles.navItem} ${selectedTab === "dashboard" ? styles.navItemActive : ""}`}
            onClick={() => setSelectedTab("dashboard")}
          >
            <i className="fas fa-chart-line"></i>
            <span>{t('dashboard') || "Dashboard"}</span>
          </button>

          <button
            className={`${styles.navItem} ${selectedTab === "courses" ? styles.navItemActive : ""}`}
            onClick={() => setSelectedTab("courses")}
          >
            <i className="fas fa-book"></i>
            <span>{t('my_courses') || "My Courses"}</span>
            <span className={styles.navBadge}>{courses.length}</span>
          </button>

          <button
            className={`${styles.navItem} ${selectedTab === "assignments" ? styles.navItemActive : ""}`}
            onClick={() => setSelectedTab("assignments")}
          >
            <i className="fas fa-tasks"></i>
            <span>{t('assignments') || "Assignments"}</span>
            <span className={styles.navBadge}>{assignments.length}</span>
          </button>

          <button
            className={`${styles.navItem} ${selectedTab === "progress" ? styles.navItemActive : ""}`}
            onClick={() => setSelectedTab("progress")}
          >
            <i className="fas fa-chart-pie"></i>
            <span>{t('progress') || "Progress"}</span>
          </button>

          <button
            className={`${styles.navItem} ${selectedTab === "upload" ? styles.navItemActive : ""}`}
            onClick={() => setSelectedTab("upload")}
          >
            <i className="fas fa-upload"></i>
            <span>{t('upload_code') || "Upload Code"}</span>
          </button>

          <button
            className={`${styles.navItem} ${selectedTab === "file-upload" ? styles.navItemActive : ""}`}
            onClick={() => setSelectedTab("file-upload")}
          >
            <i className="fas fa-file-upload"></i>
            <span>{t('upload_file') || "Upload File"}</span>
          </button>

          <button
            className={`${styles.navItem} ${selectedTab === "submissions" ? styles.navItemActive : ""}`}
            onClick={() => setSelectedTab("submissions")}
          >
            <i className="fas fa-history"></i>
            <span>{t('submissions') || "Submissions"}</span>
            {submissions.length > 0 && (
              <span className={styles.navBadge}>{submissions.length}</span>
            )}
          </button>

          <button className={styles.navItem}>
            <i className="fas fa-cog"></i>
            <span>{t('settings') || "Settings"}</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.quickStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{totalSubmissions}</div>
              <div className={styles.statLabel}>{t('submissions') || "Submissions"}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{successRate}%</div>
              <div className={styles.statLabel}>{t('success_rate') || "Success"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 🔹 ЦЕНТЪР – Основно съдържание */}
      <main className={styles.mainContent}>
        <div className={styles.dashboardHero}>
          {/* LEFT SIDE – HERO */}
          <div className={styles.mainHeader}>
            <div className={styles.welcomeSection}>
              <h1 className={styles.welcomeTitle}>
                {t('welcome_back') || "Welcome back"},{" "}
                <span className={styles.gradientName}>
                  {user?.email?.split('@')[0] || "Student"}
                </span>{" "}
                👋
              </h1>

              <h2 className={styles.heroHeadline}>
                {t('what_to_learn') || "What do you want to learn today?"}
              </h2>

              <p className={styles.welcomeSubtitle}>
                {t('welcome_subtitle') ||
                  "Discover courses, track progress, and achieve your learning goals."}
              </p>

              <div className={styles.actionsRow}>
                <button className={styles.primaryButton}>
                  <i className="fas fa-compass"></i>
                  {t('explore_courses') || "Explore Courses"}
                </button>

                <div className={styles.searchBar}>
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder={t('search_placeholder') || "Search courses, lessons..."}
                  />
                </div>
              </div>
            </div>

            <div className={styles.heroImage}>
              <img
                src="https://downloads.marketplace.jetbrains.com/files/13954/290585/icon/default.png"
                alt="Learning illustration"
              />
            </div>
          </div>

          {/* RIGHT SIDE – STATS */}
          <div className={styles.statsCards}>
            <div className={`${styles.statCard} ${styles.color1}`}>
              <i className="fas fa-code"></i>
              <div className={styles.statContent}>
                <strong>{totalSubmissions}</strong>
                <span>{t('total_submissions') || "Total Submissions"}</span>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.color2}`}>
              <i className="fas fa-check-circle"></i>
              <div className={styles.statContent}>
                <strong>{successfulSubmissions}</strong>
                <span>{t('successful') || "Successful"}</span>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.color3}`}>
              <i className="fas fa-file-code"></i>
              <div className={styles.statContent}>
                <strong>{fileUploads}</strong>
                <span>{t('file_uploads') || "File Uploads"}</span>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.color4}`}>
              <i className="fas fa-chart-line"></i>
              <div className={styles.statContent}>
                <strong>{successRate}%</strong>
                <span>{t('success_rate') || "Success Rate"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🎓 Dashboard - My Assignments */}
        {selectedTab === "dashboard" && (
          <>
            <div className={styles.sectionHeader}>
              <h2>{t('my_assignments') || "My Assignments"}</h2>
              <button className={styles.viewAllButton}>
                {t('view_all') || "View All"} <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <div className={styles.assignmentsGrid}>
              {assignments.slice(0, 4).map((assignment) => (
                <div 
                  key={assignment.id} 
                  className={styles.assignmentCard}
                  style={{ backgroundImage: `url(${assignment.backgroundImage})` }}
                >
                  <div className={styles.cardOverlay}></div>
                  
                  <div className={styles.cardContent}>
                    <div className={styles.cardTop}>
                      <span className={styles.assignmentCategory}>
                        {assignment.category}
                      </span>
                      <span className={`${styles.assignmentStatus} ${assignment.status.toLowerCase().replace(/\s+/g, '')}`}>
                        <i className={assignment.statusIcon}></i>
                        {assignment.status}
                      </span>
                    </div>

                    <div className={styles.cardMiddle}>
                      <h3 className={styles.assignmentTitle}>{assignment.title}</h3>
                      <p className={styles.assignmentDescription}>{assignment.description}</p>
                      
                      <div className={styles.assignmentProgress}>
                        <div className={styles.progressInfo}>
                          <span className={styles.progressLabel}>{t('progress') || "Progress"}</span>
                          <span className={styles.progressPercent}>{assignment.progress}%</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${assignment.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardBottom}>
                      <span className={styles.dueDate}>
                        <i className="far fa-calendar-alt"></i>
                        {t('due') || "Due"}: {assignment.dueDate}
                      </span>
                      <button className={styles.actionButton}>
                        {assignment.actionText}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Прогрес диаграми */}
            <div className={styles.chartsSection}>
              <div className={styles.chartCard}>
                <h3>{t('weekly_progress') || "Weekly Progress"}</h3>
                <div className={styles.donutChart}>
                  <div className={styles.chartCircle} style={{ '--progress': completionRate } as React.CSSProperties}>
                    <span>{completionRate}%</span>
                  </div>
                </div>
                <p>{t('weekly_completion') || "Weekly completion rate"}</p>
              </div>

              <div className={styles.chartCard}>
                <h3>{t('learning_hours') || "Learning Hours"}</h3>
                <div className={styles.barChart}>
                  {[40, 60, 80, 50, 90, 70, 85].map((height, idx) => (
                    <div 
                      key={idx} 
                      className={styles.bar} 
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <p>{t('daily_study_hours') || "Daily study hours this week"}</p>
              </div>
            </div>
          </>
        )}

        {/* 📚 My Courses Tab */}
        {selectedTab === "courses" && (
          <div className={styles.coursesSection}>
            <div className={styles.sectionHeader}>
              <h2>{t('my_courses') || "My Courses"}</h2>
              <button className={styles.viewAllButton}>
                {t('view_all') || "View All"} <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <div className={styles.coursesGrid}>
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className={styles.courseCard}
                  style={{ '--course-color': course.color } as React.CSSProperties}
                >
                  <div className={styles.courseHeader}>
                    <div className={styles.courseIcon} style={{ backgroundColor: course.color }}>
                      <i className={course.icon}></i>
                    </div>
                    <div className={styles.courseInfo}>
                      <h3 className={styles.courseTitle}>{course.title}</h3>
                      <p className={styles.courseDescription}>{course.description}</p>
                    </div>
                  </div>
                  
                  <div className={styles.courseProgress}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ 
                          width: `${course.progress}%`,
                          backgroundColor: course.color
                        }}
                      ></div>
                    </div>
                    <span className={styles.progressText}>{course.progress}% {t('complete') || "Complete"}</span>
                  </div>

                  <button className={styles.continueButton}>
                    <i className="fas fa-play-circle"></i>
                    {t('continue_learning') || "Continue Learning"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📈 Progress Tab със статистики */}
        {selectedTab === "progress" && (
          <div className={styles.progressSection}>
            <div className={styles.sectionHeader}>
              <h2>{t('learning_progress') || "Learning Progress"}</h2>
              <div className={styles.timeFilters}>
                <button className={`${styles.timeFilter} ${styles.active}`}>{t('week') || "Week"}</button>
                <button className={styles.timeFilter}>{t('month') || "Month"}</button>
                <button className={styles.timeFilter}>{t('year') || "Year"}</button>
                <button className={styles.timeFilter}>{t('all_time') || "All Time"}</button>
              </div>
            </div>

            <div className={styles.progressStats}>
              <div className={styles.progressStatCard}>
                <div className={styles.progressStatIcon}>
                  <i className="fas fa-trophy"></i>
                </div>
                <div className={styles.progressStatContent}>
                  <div className={styles.progressStatNumber}>{completionRate}%</div>
                  <div className={styles.progressStatLabel}>{t('completion_rate') || "Completion Rate"}</div>
                </div>
              </div>

              <div className={styles.progressStatCard}>
                <div className={styles.progressStatIcon}>
                  <i className="fas fa-clock"></i>
                </div>
                <div className={styles.progressStatContent}>
                  <div className={styles.progressStatNumber}>42h</div>
                  <div className={styles.progressStatLabel}>{t('total_study_hours') || "Total Study Hours"}</div>
                </div>
              </div>

              <div className={styles.progressStatCard}>
                <div className={styles.progressStatIcon}>
                  <i className="fas fa-star"></i>
                </div>
                <div className={styles.progressStatContent}>
                  <div className={styles.progressStatNumber}>{completedAssignments}</div>
                  <div className={styles.progressStatLabel}>{t('completed_tasks') || "Completed Tasks"}</div>
                </div>
              </div>

              <div className={styles.progressStatCard}>
                <div className={styles.progressStatIcon}>
                  <i className="fas fa-fire"></i>
                </div>
                <div className={styles.progressStatContent}>
                  <div className={styles.progressStatNumber}>7</div>
                  <div className={styles.progressStatLabel}>{t('streak_days') || "Streak Days"}</div>
                </div>
              </div>
            </div>

            <div className={styles.progressCharts}>
              <div className={styles.chartContainer}>
                <h3>{t('progress_over_time') || "Progress Over Time"}</h3>
                <div className={styles.lineChart}>
                  <div className={styles.chartGrid}>
                    {[75, 80, 85, 78, 90, 88, 92].map((value, idx) => (
                      <div key={idx} className={styles.chartLine}>
                        <div className={styles.chartDot}></div>
                        <div 
                          className={styles.chartValue} 
                          style={{ height: `${value}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.chartLabels}>
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <h3>{t('skill_distribution') || "Skill Distribution"}</h3>
                <div className={styles.skillsChart}>
                  {[
                    { skill: "Prolog", level: 85, color: "#9D4EDD" },
                    { skill: "Algorithms", level: 72, color: "#FF6B8B" },
                    { skill: "Data Structures", level: 65, color: "#36D1DC" },
                    { skill: "UI Design", level: 78, color: "#FFD166" },
                    { skill: "Database", level: 60, color: "#4CC9F0" },
                  ].map((skill, idx) => (
                    <div key={idx} className={styles.skillItem}>
                      <div className={styles.skillInfo}>
                        <span className={styles.skillName}>{skill.skill}</span>
                        <span className={styles.skillPercent}>{skill.level}%</span>
                      </div>
                      <div className={styles.skillBar}>
                        <div 
                          className={styles.skillLevel}
                          style={{ 
                            width: `${skill.level}%`,
                            backgroundColor: skill.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.recentActivity}>
              <h3>{t('recent_activity') || "Recent Activity"}</h3>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className={styles.activityContent}>
                    <p>{t('completed_assignment') || "Completed assignment"} "Prolog Fundamentals"</p>
                    <span>2 hours ago</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <i className="fas fa-upload"></i>
                  </div>
                  <div className={styles.activityContent}>
                    <p>{t('uploaded_file') || "Uploaded file"} "search.pl"</p>
                    <span>Yesterday</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <i className="fas fa-star"></i>
                  </div>
                  <div className={styles.activityContent}>
                    <p>{t('achieved_milestone') || "Achieved milestone"}: 50 hours of study</p>
                    <span>2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📝 Upload Section */}
        {selectedTab === "upload" && (
          <div className={styles.uploadSection}>
            <h2>{t('upload_prolog_code') || "Upload Prolog Code"}</h2>
            <div className={styles.codeEditorContainer}>
              <textarea
                className={styles.codeEditor}
                placeholder={`% ${t('write_prolog_code') || "Write your Prolog code here..."}\n% ${t('example') || "Example"}:\n% student(john, math).\n% teaches(prof_smith, math).`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
              />
              <div className={styles.editorActions}>
                <button
                  className={styles.primaryButton}
                  onClick={handleUpload}
                  disabled={!code.trim()}
                >
                  <i className="fas fa-cloud-upload-alt"></i>
                  {t('upload_code') || "Upload Code"}
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={() => setCode("")}
                >
                  <i className="fas fa-trash-alt"></i>
                  {t('clear') || "Clear"}
                </button>
              </div>
            </div>
            {uploadStatus && (
              <div className={styles.uploadStatus}>
                {uploadStatus}
              </div>
            )}
          </div>
        )}

        {/* 📎 File Upload */}
        {selectedTab === "file-upload" && (
          <div className={styles.fileUploadSection}>
            <h2>{t('upload_prolog_file') || "Upload Prolog File"}</h2>
            <div className={styles.uploadArea}>
              <div 
                className={`${styles.dropzone} ${isDragging ? styles.active : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                <p>{t('drag_drop_file') || "Drag & drop your .pl file here"}</p>
                <p className={styles.orText}>{t('or') || "or"}</p>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pl"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className={styles.fileInput}
                />
                <label htmlFor="fileInput" className={styles.browseButton}>
                  {t('browse_files') || "Browse Files"}
                </label>
              </div>
              
              {file && (
                <div className={styles.fileInfo}>
                  <i className="fas fa-file-code"></i>
                  <div>
                    <strong>{file.name}</strong>
                    <span>{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                  <button onClick={() => setFile(null)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

              <div className={styles.uploadActions}>
                <select 
                  value={folder} 
                  onChange={(e) => setFolder(e.target.value)}
                  className={styles.folderSelect}
                >
                  {folders.map((f) => (
                    <option key={f} value={f}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </option>
                  ))}
                </select>
                
                <button
                  className={styles.uploadButton}
                  onClick={handleFileUpload}
                  disabled={!file}
                >
                  <i className="fas fa-upload"></i>
                  {t('upload_to') || "Upload to"} {folder}
                </button>
              </div>
            </div>
            {uploadStatus && (
              <div className={styles.uploadStatus}>
                {uploadStatus}
              </div>
            )}
          </div>
        )}

        {/* 📋 Submissions */}
        {selectedTab === "submissions" && (
          <div className={styles.submissionsSection}>
            <h2>{t('recent_submissions') || "Recent Submissions"} ({submissions.length})</h2>
            {submissions.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fas fa-inbox"></i>
                <p>{t('no_submissions') || "No submissions yet"}</p>
                <button 
                  className={styles.primaryButton}
                  onClick={() => setSelectedTab("upload")}
                >
                  {t('make_first_submission') || "Make your first submission"}
                </button>
              </div>
            ) : (
              <div className={styles.submissionsList}>
                {submissions.map((sub) => (
                  <div key={sub.id} className={styles.submissionItem}>
                    <div className={styles.submissionInfo}>
                      <h4>{sub.name}</h4>
                      <p>{sub.date}</p>
                      <code className={styles.codePreview}>
                        {sub.code?.substring(0, 80)}...
                      </code>
                    </div>
                    <div className={`${styles.statusBadge} ${styles[sub.status]}`}>
                      {getStatusText(sub.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🎯 Assignments Tab (отделна таб за assignments) */}
        {selectedTab === "assignments" && (
          <div className={styles.assignmentsSection}>
            <div className={styles.sectionHeader}>
              <h2>{t('all_assignments') || "All Assignments"}</h2>
              <div className={styles.assignmentFilters}>
                <button className={`${styles.filterButton} ${styles.active}`}>{t('all') || "All"}</button>
                <button className={styles.filterButton}>{t('in_progress') || "In Progress"}</button>
                <button className={styles.filterButton}>{t('completed') || "Completed"}</button>
                <button className={styles.filterButton}>{t('pending') || "Pending"}</button>
              </div>
            </div>

            <div className={styles.assignmentsGridDetailed}>
              {assignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className={styles.assignmentCardDetailed}
                  style={{ backgroundImage: `linear-gradient(135deg, ${assignment.category === 'Design' ? '#FF6B8B' : assignment.category === 'Programming' ? '#36D1DC' : assignment.category === 'Algorithms' ? '#FFD166' : assignment.category === 'Data Science' ? '#9D4EDD' : '#4CC9F0'}40, ${assignment.category === 'Design' ? '#FF6B8B' : assignment.category === 'Programming' ? '#36D1DC' : assignment.category === 'Algorithms' ? '#FFD166' : assignment.category === 'Data Science' ? '#9D4EDD' : '#4CC9F0'}20)` }}
                >
                  <div className={styles.assignmentHeader}>
                    <div className={styles.assignmentIcon} style={{ backgroundColor: assignment.category === 'Design' ? '#FF6B8B' : assignment.category === 'Programming' ? '#36D1DC' : assignment.category === 'Algorithms' ? '#FFD166' : assignment.category === 'Data Science' ? '#9D4EDD' : '#4CC9F0' }}>
                      <i className={assignment.category === 'Design' ? 'fas fa-palette' : assignment.category === 'Programming' ? 'fas fa-code' : assignment.category === 'Algorithms' ? 'fas fa-brain' : 'fas fa-project-diagram'}></i>
                    </div>
                    <div>
                      <h3>{assignment.title}</h3>
                      <span className={styles.assignmentCategoryDetailed}>{assignment.category}</span>
                    </div>
                  </div>

                  <p className={styles.assignmentDescriptionDetailed}>{assignment.description}</p>

                  <div className={styles.assignmentStats}>
                    <div className={styles.stat}>
                      <i className="fas fa-chart-line"></i>
                      <span>{assignment.progress}% {t('complete') || "Complete"}</span>
                    </div>
                    <div className={styles.stat}>
                      <i className="far fa-clock"></i>
                      <span>{t('due') || "Due"}: {assignment.dueDate}</span>
                    </div>
                    <div className={styles.stat}>
                      <i className="fas fa-file-alt"></i>
                      <span>12 {t('tasks') || "tasks"}</span>
                    </div>
                  </div>

                  <div className={styles.assignmentActions}>
                    <button className={styles.startButton}>
                      <i className="fas fa-play"></i>
                      {assignment.actionText}
                    </button>
                    <button className={styles.detailsButton}>
                      <i className="fas fa-info-circle"></i>
                      {t('details') || "Details"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}