import { useState, useRef, useEffect } from "react";
import styles from "./Prolog.module.css";

interface Message {
  user: boolean;
  text: string;
  id: string;
  timestamp: Date;
}

export default function PrologChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Folders configuration
  const folders = [
    { id: "animals", label: "Animals", icon: "fas fa-paw", description: "Animal facts and relationships" },
    { id: "history", label: "History", icon: "fas fa-landmark", description: "Historical events and figures" },
    { id: "geography", label: "Geography", icon: "fas fa-globe-americas", description: "Geographical facts and locations" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const frame = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(frame);
  }, [messages]);

  // Load domain
  const loadFolder = async (folder: string) => {
    setIsLoading(true);
    setSelectedFolder(folder);

    const thinkingMsg: Message = {
      user: false,
      text: `Loading ${folder} domain...`,
      id: "thinking-" + Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, thinkingMsg]);

    try {
      const res = await fetch("https://prolog-api-server-1.onrender.com/prolog/select-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: folder })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setMessages(prev => [
        ...prev.filter(msg => msg.id !== thinkingMsg.id),
        {
          user: false,
          text: data.message || "Domain loaded successfully.",
          id: Date.now().toString(),
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== thinkingMsg.id),
        {
          user: false,
          text: `❌ Error loading ${folder} domain: ${err.message}`,
          id: Date.now().toString(),
          timestamp: new Date()
        }
      ]);
      setSelectedFolder(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Send user query
  const sendQuery = async () => {
    if (!query.trim() || !selectedFolder || isLoading) return;

    const userMsg: Message = {
      user: true,
      text: query,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    const thinkingMsg: Message = {
      user: false,
      text: "Thinking",
      id: "thinking-" + Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, thinkingMsg]);

    let dotCount = 1;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount % 3) + 1;
      const dots = ".".repeat(dotCount);
      setMessages(prev =>
        prev.map(msg => msg.id === thinkingMsg.id ? { ...msg, text: `Thinking${dots}` } : msg)
      );
    }, 500);

    try {
      const res = await fetch("https://prolog-api-server-1.onrender.com/prolog/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: query })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      clearInterval(dotInterval);
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMsg.id));

      const resultText = data.output || data.error || "No response from server";
      setMessages(prev => [...prev, {
        user: false,
        text: resultText,
        id: Date.now().toString(),
        timestamp: new Date()
      }]);
    } catch (err: any) {
      clearInterval(dotInterval);
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMsg.id));
      setMessages(prev => [...prev, {
        user: false,
        text: `❌ Connection error: ${err.message}`,
        id: Date.now().toString(),
        timestamp: new Date()
      }]);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedFolder(null);
  };

  return (
    <div className={styles.prologChat}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div>
          <h1 className={styles.chatTitle}>
            Prolog <span className={styles.titleHighlight}>AI Console</span>
          </h1>
          <div className={styles.chatSubtitle}>
            <i className="fas fa-code"></i>
            Interactive Prolog query interface with domain-specific knowledge bases
          </div>
        </div>
        <button 
          onClick={clearChat}
          className={styles.clearButton}
          title="Clear chat"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>

      {/* Folder Selector */}
      <div className={styles.folderSelector}>
        <div className={styles.folderGrid}>
          {folders.map(folder => (
            <button
              key={folder.id}
              className={`${styles.folderButton} ${selectedFolder === folder.id ? styles.active : ''}`}
              onClick={() => loadFolder(folder.id)}
              disabled={isLoading}
              title={folder.description}
            >
              <div className={styles.folderIcon}>
                <i className={folder.icon}></i>
              </div>
              <div className={styles.folderName}>{folder.label}</div>
              <div className={styles.folderLabel}>{folder.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Status */}
      {selectedFolder && (
        <div className={styles.domainStatus}>
          <span className={styles.domainStatusIcon}>
            <i className="fas fa-check-circle"></i>
          </span>
          <span className={styles.domainStatusText}>
            Active domain: <strong>{selectedFolder}</strong>
          </span>
        </div>
      )}

      {/* Chat */}
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div className={styles.welcomeContainer}>
              <div className={styles.welcomeIcon}><i className="fas fa-robot"></i></div>
              <div className={styles.welcomeText}>
                🤖 Welcome to Prolog AI Console!<br />
                <small>Select a domain above to start querying the knowledge base.</small>
              </div>
              <div className={styles.welcomeExamples}>
                <div className={styles.exampleTitle}>Example queries:</div>
                <div className={styles.exampleItem}>• load_all.</div>
                <div className={styles.exampleItem}>• list_files.</div>
                <div className={styles.exampleItem}>• help.</div>
                <div className={styles.exampleItem}>• consult_file('filename').</div>
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`${styles.messageWrapper} ${msg.user ? styles.userMessage : styles.botMessage}`}>
                <div className={styles.messageBubble}>
                  <div className={styles.messageText}>
                    {msg.text.split("\n").map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                  <div className={styles.messageTime}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedFolder ? `Enter Prolog query for ${selectedFolder} domain...` : "Select a domain first"}
            disabled={isLoading || !selectedFolder}
            className={styles.chatInput}
          />
          <button
            onClick={sendQuery}
            disabled={isLoading || !query.trim() || !selectedFolder}
            className={styles.sendButton}
            title="Send query"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.chatFooter}>
        <div className={styles.footerText}>
          <i className="fas fa-info-circle"></i>
          <span>Prolog AI Console • Use Prolog syntax for queries • Make sure queries end with a period</span>
        </div>
      </div>
    </div>
  );
}