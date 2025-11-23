import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../services/firebase";
import "./PrologChat.css";

interface Message {
  user: boolean;
  text: string;
  id: string;
  timestamp: Date;
}

interface PrologCode {
  id: string;
  code: string;
}

export default function PrologChat() {
  const { codeId } = useParams<{ codeId?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allCodes, setAllCodes] = useState<PrologCode[]>([]);
  const [activeCode, setActiveCode] = useState<PrologCode | null>(null);
  const [isLoadingCode, setIsLoadingCode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQueries = [
    { label: "Help", query: "help." },
    { label: "List Facts", query: "listing." },
  ];

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  // Load all Prolog codes from database
  useEffect(() => {
    async function loadAllCodes() {
      setIsLoadingCode(true);
      try {
        const snapshot = await getDocs(collection(db, "prologCodes"));
        const codes: PrologCode[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          code: (docSnap.data() as { code: string }).code,
        }));
        setAllCodes(codes);

        // If codeId provided, set it as active
        if (codeId) {
          const specific = codes.find(c => c.id === codeId);
          if (specific) {
            setActiveCode(specific);
            console.log("✅ Activated specific code:", codeId);
          }
        }
      } catch (err) {
        console.error("❌ Failed to load Prolog codes:", err);
      } finally {
        setIsLoadingCode(false);
      }
    }
    loadAllCodes();
  }, [codeId]);

  const sendQuery = async (customQuery?: string) => {
    const finalQuery = customQuery ?? query;
    if (!finalQuery.trim() || isLoading) return;

    const userMsg: Message = {
      user: true,
      text: finalQuery,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");

    // Check if query matches a code activation command
    const matchingCode = allCodes.find(c =>
      c.code.includes(`${finalQuery} :-`) || c.code.includes(`${finalQuery}.`)
    );
    if (matchingCode) {
      setActiveCode(matchingCode);
      setMessages(prev => [...prev, {
        user: false,
        text: `✅ Activated code: ${matchingCode.id}`,
        id: Date.now().toString(),
        timestamp: new Date(),
      }]);
    }

    if (!activeCode && !matchingCode) {
      setMessages(prev => [...prev, {
        user: false,
        text: "❌ No code is active. Use a start command (e.g., start. or start_animal.)",
        id: Date.now().toString(),
        timestamp: new Date(),
      }]);
      return;
    }

    const codeToUse = matchingCode?.code || activeCode?.code;
    if (!codeToUse) return;

    setIsLoading(true);
    try {
      const res = await fetch("https://prolog.onrender.com/prolog-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToUse, query: finalQuery }),
      });

      const text = await res.text();
      const botMsg: Message = {
        user: false,
        text,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        user: false,
        text: `❌ Error: ${err.message}`,
        id: Date.now().toString(),
        timestamp: new Date(),
      }]);
    }
    setIsLoading(false);
  };

  const formatCode = (code: string) =>
    code
      .split("\n")
      .map(line => {
        if (line.trim().startsWith("%")) return `<span class="code-comment">${line}</span>`;
        if (line.includes(":-")) return `<span class="code-rule">${line}</span>`;
        if (line.trim().endsWith(".")) return `<span class="code-fact">${line}</span>`;
        return line;
      })
      .join("\n");

  return (
    <div className="prolog-chat">
      <div className="chat-container">
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-left">
              <div className="chat-avatar"><i className="fas fa-robot"></i></div>
              <div className="header-info">
                <h2>Prolog Assistant</h2>
                <p>{isLoadingCode ? "🔍 Loading codes..." : activeCode ? `✅ Code ${activeCode.id} active` : "❌ No active code"}</p>
              </div>
            </div>
            <div className="quick-queries">
              {quickQueries.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQuery(btn.query)}
                  disabled={isLoading || isLoadingCode}
                  className="quick-query-btn"
                >
                  <i className="fas fa-bolt"></i>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="messages-container">
            {(messages.length === 0 ? [{ user: false, text: "🤖 Welcome! Enter any Prolog query to start.", id: "welcome", timestamp: new Date() }] : messages).map(msg => (
              <div key={msg.id} className={`message-wrapper ${msg.user ? "user-message" : "bot-message"}`}>
                <div className="message-content">
                  {!msg.user && <div className="message-avatar bot-avatar"><i className="fas fa-robot"></i></div>}
                  <div className="message-bubble">
                    <div className="message-text">{msg.text.split("\n").map((line,i) => <div key={i}>{line}</div>)}</div>
                    <div className="message-time">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  {msg.user && <div className="message-avatar user-avatar"><i className="fas fa-user"></i></div>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="scroll-anchor" />
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendQuery()}
                placeholder={isLoadingCode ? "Loading Prolog code..." : "Enter your Prolog query"}
                className="chat-input"
                disabled={isLoading || isLoadingCode}
              />
              <button
                onClick={() => sendQuery()}
                disabled={isLoading || isLoadingCode || !query.trim()}
                className="send-button"
              >
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="knowledge-sidebar">
        <div className="sidebar-header">
          <h3><i className="fas fa-database"></i> Knowledge Base</h3>
        </div>
        <div className="code-preview">
          {isLoadingCode ? (
            <div className="no-code"><i className="fas fa-spinner fa-spin"></i><p>Loading codes...</p></div>
          ) : activeCode ? (
            <pre className="prolog-code"><code dangerouslySetInnerHTML={{ __html: formatCode(activeCode.code) }} /></pre>
          ) : (
            <div className="no-code"><i className="fas fa-file-code"></i><p>No active code</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
