import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
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

import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("upload");
  const [code, setCode] = useState("");

  const [submissions, setSubmissions] = useState<
    { id: string; name: string; date: string; status: string }[]
  >([]);

  // Load user submissions from Firestore
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
        status: doc.data().status ?? "success"
      }));

      setSubmissions(data);
    });

    return () => unsub();
  }, [user]);

  // Upload code to Firestore
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
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <i className="fas fa-check-circle status-success"></i>;
      case "error":
        return <i className="fas fa-exclamation-circle status-error"></i>;
      default:
        return <i className="fas fa-clock status-pending"></i>;
    }
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-welcome">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <h3>Welcome back!</h3>
              <p>{user?.email ?? "student@ideas.edu"}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${selectedTab === "upload" ? "nav-item-active" : ""}`}
            onClick={() => setSelectedTab("upload")}
          >
            <i className="fas fa-upload"></i>
            <span>Upload Prolog Code</span>
          </button>

          <button
            className={`nav-item ${selectedTab === "submissions" ? "nav-item-active" : ""}`}
            onClick={() => setSelectedTab("submissions")}
          >
            <i className="fas fa-history"></i>
            <span>My Submissions</span>
            {submissions.length > 0 && (
              <span className="nav-badge">{submissions.length}</span>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="quick-stats">
            <div className="stat">
              <div className="stat-value">{submissions.length}</div>
              <div className="stat-label">Submissions</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {selectedTab === "upload" && "Upload Prolog Code"}
            {selectedTab === "submissions" && "My Submissions"}
          </h1>
        </div>

        <div className="dashboard-content">

          {/* UPLOAD TAB */}
          {selectedTab === "upload" && (
            <div className="upload-section">
              <div className="section-header">
                <h2>Write Your Prolog Code</h2>
              </div>

              <textarea
                className="code-editor"
                placeholder={`% Write your Prolog code here...`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <button
                className="upload-button"
                onClick={handleUpload}
                disabled={!code.trim()}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                Upload Code
              </button>
            </div>
          )}

          {/* SUBMISSIONS TAB */}
          {selectedTab === "submissions" && (
            <div className="submissions-section">
              <div className="section-header">
                <h2>Your Prolog Submissions</h2>
              </div>

              {submissions.length === 0 ? (
                <div className="empty-state">
                  <h3>No submissions yet</h3>
                </div>
              ) : (
                <div className="submissions-grid">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="submission-card">
                      <div className="submission-header">
                        <div>
                          <h4>{sub.name}</h4>
                          <span className="submission-date">{sub.date}</span>
                        </div>
                        <div className="submission-status">
                          {getStatusIcon(sub.status)}
                        </div>
                      </div>

                      <div className="submission-actions">
                        <button className="action-btn view-btn">
                          <i className="fas fa-eye"></i> View
                        </button>
                        <button className="action-btn run-btn">
                          <i className="fas fa-play"></i> Run Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
