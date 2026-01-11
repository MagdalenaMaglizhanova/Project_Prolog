import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import styles from "./PrologChat.module.css";

interface Message {
  user: boolean;
  text: string;
  id: string;
  timestamp: Date;
}

interface PrologCode {
  id: string;
  code: string;
  title?: string;
  domain?: string;
}

export default function PrologChat() {
  const { codeId } = useParams<{ codeId?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allCodes, setAllCodes] = useState<PrologCode[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isLoadingDomain, setIsLoadingDomain] = useState(false);
  const [activeTab, _setActiveTab] = useState<"chat" | "code">("chat");
  const [fileNameInput, setFileNameInput] = useState("");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  // Domains configuration with translations
  const domains = [
    { 
      id: "animals", 
      label: t('animals') || 'Animals', 
      icon: "fas fa-paw", 
      description: t('animal_facts_description') || 'Animal facts and relationships', 
      color: "#FF6B8B" 
    },
    { 
      id: "history", 
      label: t('history') || 'History', 
      icon: "fas fa-landmark", 
      description: t('historical_facts_description') || 'Historical events and figures', 
      color: "#36D1DC" 
    },
    { 
      id: "geography", 
      label: t('geography') || 'Geography', 
      icon: "fas fa-globe-americas", 
      description: t('geographical_facts_description') || 'Geographical facts and locations', 
      color: "#FFD166" 
    },
    { 
      id: "mineralwater", 
      label: t('mineral_water') || 'Mineral Water', 
      icon: "fas fa-tint", 
      description: t('mineral_water_description') || 'Mineral water sources and properties', 
      color: "#9D4EDD" 
    },
    { 
      id: "balkan", 
      label: t('balkan') || 'Central Balkan', 
      icon: "fas fa-mountain", 
      description: t('balkan_description') || 'Balkan sources and properties', 
      color: "#9D4EDD" 
    }
    
  ];

  // System commands with translations
  const systemCommands = [
    { 
      label: t('help'), 
      query: "help", 
      icon: "fas fa-question-circle", 
      color: "#4A90E2",
      tooltip: t('help_tooltip') || 'Show help information'
    },
    { 
      label: t('load_all') || 'Load All', 
      query: "load_all", 
      icon: "fas fa-download", 
      color: "#50C878",
      tooltip: t('load_all_tooltip') || 'Load all Prolog files'
    },
    { 
      label: t('list_files') || 'List Files', 
      query: "list_files", 
      icon: "fas fa-list", 
      color: "#FF6B8B",
      tooltip: t('list_files_tooltip') || 'List all loaded files'
    },
    { 
      label: t('clear_facts') || 'Clear Facts', 
      query: "clear_all_facts", 
      icon: "fas fa-trash", 
      color: "#FF4757",
      tooltip: t('clear_facts_tooltip') || 'Clear all loaded facts'
    },
    { 
      label: t('current_file') || 'Current File', 
      query: "current_file", 
      icon: "fas fa-file", 
      color: "#9D4EDD",
      tooltip: t('current_file_tooltip') || 'Show current active file'
    },
    { 
      label: t('list_predicates') || 'List Predicates', 
      query: "list_predicates", 
      icon: "fas fa-code", 
      color: "#36D1DC",
      tooltip: t('list_predicates_tooltip') || 'List all available predicates'
    },
    { 
      label: t('unload_all') || 'Unload All', 
      query: "unload_all", 
      icon: "fas fa-times-circle", 
      color: "#FF9500",
      tooltip: t('unload_all_tooltip') || 'Unload all Prolog files'
    },
  ];

  // File commands with translations
  const fileCommands = [
    { 
      label: t('consult_file') || 'Consult File', 
      icon: "fas fa-file-import", 
      color: "#50C878",
      tooltip: t('consult_file_tooltip') || 'Load a Prolog file',
      action: () => {
        if (fileNameInput.trim()) {
          sendQuery(`consult_file('${fileNameInput.trim()}')`);
          setFileNameInput("");
        }
      }
    },
    { 
      label: t('reconsult_file') || 'Reconsult File', 
      icon: "fas fa-sync-alt", 
      color: "#4A90E2",
      tooltip: t('reconsult_file_tooltip') || 'Reload a Prolog file',
      action: () => {
        if (fileNameInput.trim()) {
          sendQuery(`reconsult_file('${fileNameInput.trim()}')`);
          setFileNameInput("");
        }
      }
    },
    

  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages]);

  // Check if chat should be expanded based on content
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const contentHeight = container.scrollHeight;
      const containerHeight = container.clientHeight;
      
      // If content is significantly taller than container, auto-expand
      if (contentHeight > containerHeight * 1.5 && contentHeight > 500) {
        setIsChatExpanded(true);
      } else if (contentHeight < 400) {
        setIsChatExpanded(false);
      }
    }
  }, [messages]);

  // Load all Prolog codes from database
  useEffect(() => {
    async function loadAllCodes() {
      try {
        const snapshot = await getDocs(collection(db, "prologCodes"));
        const codes: PrologCode[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          code: docSnap.data().code || "",
          title: docSnap.data().title,
          domain: docSnap.data().domain || "general"
        }));
        setAllCodes(codes);

        if (codeId) {
          const specific = codes.find(c => c.id === codeId);
          if (specific && specific.domain) {
            setSelectedDomain(specific.domain);
            loadDomain(specific.domain);
          }
        }
      } catch (err) {
        console.error("Failed to load Prolog codes:", err);
      }
    }
    loadAllCodes();
  }, [codeId]);

  // Load domain from API
  const loadDomain = async (domain: string) => {
    setIsLoadingDomain(true);
    setSelectedDomain(domain);

    // Clear previous domain activation message
    setMessages(prev => prev.filter(msg => !msg.text.includes(
      language === 'bg' ? 'домейн зареден успешно' : 
      language === 'es' ? 'dominio cargado exitosamente' : 
      'Domain loaded successfully'
    )));

    const thinkingMsg: Message = {
      user: false,
      text: t('loading_domain') ? `${t('loading_domain')} ${domain}...` : 
            language === 'bg' ? `Зареждане на домейн ${domain}...` : 
            language === 'es' ? `Cargando dominio ${domain}...` : 
            `Loading ${domain} domain...`,
      id: "domain-loading-" + Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, thinkingMsg]);

    try {
      const res = await fetch("https://prolog-api-server-1.onrender.com/prolog/select-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setMessages(prev => [
        ...prev.filter(msg => msg.id !== thinkingMsg.id),
        {
          user: false,
          text: data.message || 
                (t('domain_loaded_success') ? `${t('domain_loaded_success')} ${domain}` :
                 language === 'bg' ? `✅ Домейн ${domain} зареден успешно. Готов за заявки.` : 
                 language === 'es' ? `✅ Dominio ${domain} cargado exitosamente. Listo para consultas.` :
                 `✅ ${domain} domain loaded successfully. Ready for queries.`),
          id: Date.now().toString(),
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== thinkingMsg.id),
        {
          user: false,
          text: t('domain_load_error') ? `${t('domain_load_error')} ${domain}: ${err.message}` :
                language === 'bg' ? `❌ Грешка при зареждане на домейн ${domain}: ${err.message}` : 
                language === 'es' ? `❌ Error cargando dominio ${domain}: ${err.message}` :
                `❌ Error loading ${domain} domain: ${err.message}`,
          id: Date.now().toString(),
          timestamp: new Date()
        }
      ]);
      setSelectedDomain(null);
    } finally {
      setIsLoadingDomain(false);
    }
  };

  // Send query
  const sendQuery = async (customQuery?: string) => {
    const finalQuery = customQuery ?? query;
    if (!finalQuery.trim() || isLoading || !selectedDomain) return;

    // Handle clear command
    if (finalQuery.trim() === "clear." || finalQuery.trim() === "clear") {
      setMessages([]);
      setQuery("");
      setIsChatExpanded(false);
      return;
    }

    // Handle examples command
    if (finalQuery.trim() === "examples.") {
      const examples = language === 'bg' ? [
        "Домейн Животни: animal(X)., mammal(X)., bird(X).",
        "Домейн История: event(X)., person(X)., year(Event, Year).",
        "Домейн География: country(X)., capital(Country, Capital)., river(X).",
        "Системни команди: help., list_files., load_all., clear_all_facts.",
        "Файлови команди: consult_file('filename')., unload_file('filename')."
      ] : language === 'es' ? [
        "Dominio Animales: animal(X)., mammal(X)., bird(X).",
        "Dominio Historia: event(X)., person(X)., year(Event, Year).",
        "Dominio Geografía: country(X)., capital(Country, Capital)., river(X).",
        "Comandos del sistema: help., list_files., load_all., clear_all_facts.",
        "Comandos de archivo: consult_file('filename')., unload_file('filename')."
      ] : [
        "Animals domain: animal(X)., mammal(X)., bird(X).",
        "History domain: event(X)., person(X)., year(Event, Year).",
        "Geography domain: country(X)., capital(Country, Capital)., river(X).",
        "System commands: help., list_files., load_all., clear_all_facts.",
        "File commands: consult_file('filename')., unload_file('filename')."
      ];
      
      const welcomeMessage = t('example_queries') || '📚 Example Queries:\n\n';
      
      setMessages(prev => [...prev, {
        user: false,
        text: welcomeMessage + examples.map(ex => `• ${ex}`).join('\n'),
        id: Date.now().toString(),
        timestamp: new Date(),
      }]);
      setQuery("");
      return;
    }

    const userMsg: Message = {
      user: true,
      text: finalQuery,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    
    await sendDomainQuery(finalQuery);
  };

  const sendDomainQuery = async (queryText: string) => {
    if (!selectedDomain) return;
    
    setIsLoading(true);

    const thinkingMsg: Message = {
      user: false,
      text: t('thinking') || "Thinking",
      id: "thinking-" + Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, thinkingMsg]);

    let dotCount = 1;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount % 3) + 1;
      const dots = ".".repeat(dotCount);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === thinkingMsg.id ? { 
            ...msg, 
            text: `${t('thinking') || 'Thinking'}${dots}` 
          } : msg
        )
      );
    }, 500);

    try {
      const res = await fetch("https://prolog-api-server-1.onrender.com/prolog/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: queryText })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      clearInterval(dotInterval);
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMsg.id));
      
      const resultText = data.output || data.error || data.message || 
                        (t('no_server_response') || "No response from server");
      
      const botMsg: Message = {
        user: false,
        text: resultText,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      clearInterval(dotInterval);
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMsg.id));
      setMessages(prev => [...prev, {
        user: false,
        text: t('connection_error') ? `${t('connection_error')}: ${err.message}` :
              language === 'bg' ? `❌ Грешка при връзка: ${err.message}` : 
              language === 'es' ? `❌ Error de conexión: ${err.message}` :
              `❌ Connection error: ${err.message}`,
        id: Date.now().toString(),
        timestamp: new Date(),
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
    setSelectedDomain(null);
    setIsChatExpanded(false);
  };

  const toggleChatExpansion = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  const formatCode = (code: string) =>
    code
      .split("\n")
      .map(line => {
        if (line.trim().startsWith("%")) return `<span class="${styles.codeComment}">${line}</span>`;
        if (line.includes(":-")) return `<span class="${styles.codeRule}">${line}</span>`;
        if (line.trim().endsWith(".")) return `<span class="${styles.codeFact}">${line}</span>`;
        if (line.includes("?-")) return `<span class="${styles.codeQuery}">${line}</span>`;
        return line;
      })
      .join("\n");

  // Filter codes by selected domain
  const getFilteredCodes = () => {
    if (!selectedDomain) return allCodes;
    return allCodes.filter(code => code.domain === selectedDomain);
  };

  // Get welcome message based on language
  const getWelcomeMessage = () => {
    if (language === 'bg') {
      return `Добре дошли в Prolog AI помощника!\n\nРаботя със специфични за домейн бази от знания, използвайки Prolog API сървър.\n\n1. Изберете домейн от знания от лявата странична лента\n2. Използвайте системните команди по-горе за управление на файлове\n3. Изпращайте Prolog заявки за взаимодействие с базата знания\n\nНалични домейни:\n${domains.map(d => `• ${d.label} - ${d.description}`).join('\\n')}\n\nОпитайте командата 'help.' за да видите всички налични команди.`;
    } else if (language === 'es') {
      return `¡Bienvenido al Asistente AI de Prolog!\n\nTrabajo con bases de conocimiento específicas de dominio utilizando el servidor API de Prolog.\n\n1. Seleccione un dominio de conocimiento de la barra lateral izquierda\n2. Use los comandos del sistema arriba para gestionar archivos\n3. Envíe consultas Prolog para interactuar con la base de conocimiento\n\nDominios disponibles:\n${domains.map(d => `• ${d.label} - ${d.description}`).join('\\n')}\n\nPruebe el comando 'help.' para ver todos los comandos disponibles.`;
    } else {
      return `Welcome to Prolog AI Assistant!\n\nI work with domain-specific knowledge bases using the Prolog API server.\n\n1. Select a knowledge domain from the left sidebar\n2. Use system commands above to manage files\n3. Send Prolog queries to interact with the knowledge base\n\nAvailable domains:\n${domains.map(d => `• ${d.label} - ${d.description}`).join('\\n')}\n\nTry 'help.' command to see all available commands.`;
    }
  };

  const themeClass = theme === 'dark' ? styles.darkTheme : styles.lightTheme;

  return (
    <div className={`${styles.prologChat} ${themeClass}`}>
      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${theme === 'dark' ? styles.sidebarDark : styles.sidebarLight}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <img src="/images/logo_shevici.jpg" alt="Digital Bulgaria" />
            </div>
            <div className={`${styles.userEmail} ${theme === 'dark' ? styles.userEmailDark : ''}`}>
              {t('prolog_assistant') || 'Prolog AI Assistant'}
            </div>
            <h3 className={`${styles.welcomeText} ${theme === 'dark' ? styles.welcomeTextDark : ''}`}>
              {t('domain_based_knowledge') || 'Domain-Based Knowledge'}
            </h3>
          </div>

          <div className={`${styles.sidebarStats} ${theme === 'dark' ? styles.sidebarStatsDark : styles.sidebarStatsLight}`}>
            <div className={`${styles.statsTitle} ${theme === 'dark' ? styles.statsTitleDark : ''}`}>
              <i className="fas fa-chart-bar"></i>
              {t('chat_stats') || 'Chat Stats'}
            </div>
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${theme === 'dark' ? styles.statCardDark : styles.statCardLight}`}>
                <div className={`${styles.statValue} ${theme === 'dark' ? styles.statValueDark : ''}`}>
                  {messages.filter(m => m.user).length}
                </div>
                <div className={`${styles.statLabel} ${theme === 'dark' ? styles.statLabelDark : ''}`}>
                  {t('queries') || 'Queries'}
                </div>
              </div>
              <div className={`${styles.statCard} ${theme === 'dark' ? styles.statCardDark : styles.statCardLight}`}>
                <div className={`${styles.statValue} ${theme === 'dark' ? styles.statValueDark : ''}`}>
                  {getFilteredCodes().length}
                </div>
                <div className={`${styles.statLabel} ${theme === 'dark' ? styles.statLabelDark : ''}`}>
                  {t('code_files') || 'Code Files'}
                </div>
              </div>
              <div className={`${styles.statCard} ${theme === 'dark' ? styles.statCardDark : styles.statCardLight}`}>
                <div className={`${styles.statValue} ${theme === 'dark' ? styles.statValueDark : ''}`}>
                  {selectedDomain || (t('none') || 'None')}
                </div>
                <div className={`${styles.statLabel} ${theme === 'dark' ? styles.statLabelDark : ''}`}>
                  {t('active_domain') || 'Active Domain'}
                </div>
              </div>
              <div className={`${styles.statCard} ${theme === 'dark' ? styles.statCardDark : styles.statCardLight}`}>
                <div className={`${styles.statValue} ${theme === 'dark' ? styles.statValueDark : ''}`}>
                  {selectedDomain ? "✓" : "✗"}
                </div>
                <div className={`${styles.statLabel} ${theme === 'dark' ? styles.statLabelDark : ''}`}>
                  {t('status') || 'Status'}
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.domainSelector} ${theme === 'dark' ? styles.domainSelectorDark : ''}`}>
            <div className={styles.selectorHeader}>
              <h4 className={theme === 'dark' ? styles.selectorHeaderDark : ''}>
                <i className="fas fa-layer-group"></i> 
                {t('knowledge_domains') || 'Knowledge Domains'}
              </h4>
            </div>
            <div className={styles.domainGrid}>
              {domains.map(domain => (
                <button
                  key={domain.id}
                  className={`${styles.domainButton} ${selectedDomain === domain.id ? styles.domainActive : ''} ${theme === 'dark' ? styles.domainButtonDark : ''}`}
                  onClick={() => loadDomain(domain.id)}
                  disabled={isLoadingDomain}
                  title={domain.description}
                  style={{ '--domain-color': domain.color } as React.CSSProperties}
                >
                  <div className={styles.domainIcon}>
                    <i className={domain.icon}></i>
                  </div>
                  <div className={`${styles.domainName} ${theme === 'dark' ? styles.domainNameDark : ''}`}>
                    {domain.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`${styles.mainContent} ${theme === 'dark' ? styles.mainContentDark : ''}`}>
        <div className={`${styles.header} ${theme === 'dark' ? styles.headerDark : ''}`}>
          <div className={styles.titleContainer}>
            <h1 className={`${styles.title} ${theme === 'dark' ? styles.titleDark : ''}`}>
              {t('prolog_assistant') || 'Prolog AI Assistant'}
              <span className={`${styles.titleHighlight} ${theme === 'dark' ? styles.titleHighlightDark : ''}`}>
                {selectedDomain ? 
                  ` | ${t('domain') || 'Domain'}: ${selectedDomain}` : 
                  ` | ${t('no_active_domain') || 'No Active Domain'}`}
              </span>
            </h1>
            <div className={styles.headerActions}>
              <button 
                onClick={clearChat}
                className={`${styles.clearChatButton} ${theme === 'dark' ? styles.clearChatButtonDark : ''}`}
                title={t('clear_chat') || 'Clear chat'}
              >
                <i className="fas fa-trash-alt"></i>
                {t('clear_chat') || 'Clear Chat'}
              </button>
              <div className={`${styles.dateIndicator} ${theme === 'dark' ? styles.dateIndicatorDark : ''}`}>
                <i className="far fa-clock"></i>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.content} ${theme === 'dark' ? styles.contentDark : ''}`}>
          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div className={styles.chatSection}>
              <div className={styles.compactPanelsContainer}>
  {/* SYSTEM COMMANDS - ултра компактен */}
  <div className={`${styles.systemCommandsCompact} ${theme === 'dark' ? styles.systemCommandsDark : ''}`}>
    <div className={`${styles.commandsHeaderCompact} ${theme === 'dark' ? styles.commandsHeaderDark : ''}`}>
      <i className="fas fa-terminal"></i>
      <span className={styles.headerLabel}>System</span>
    </div>
    <div className={styles.commandsRow}>
      {systemCommands.map((cmd, idx) => (
        <button
          key={idx}
          onClick={() => sendQuery(cmd.query)}
          disabled={isLoading || isLoadingDomain || !selectedDomain}
          className={styles.commandButtonTiny}
          style={{ backgroundColor: cmd.color }}
          title={cmd.tooltip}
        >
          <i className={cmd.icon}></i>
        </button>
      ))}
    </div>
  </div>

  {/* FILE COMMANDS - ултра компактен */}
  <div className={`${styles.fileCommandsCompact} ${theme === 'dark' ? styles.fileCommandsDark : ''}`}>
    <div className={`${styles.commandsHeaderCompact} ${theme === 'dark' ? styles.commandsHeaderDark : ''}`}>
      <i className="fas fa-file-code"></i>
      <span className={styles.headerLabel}>Files</span>
    </div>
    <div className={styles.fileInputRow}>
      <input
        type="text"
        value={fileNameInput}
        onChange={e => setFileNameInput(e.target.value)}
        placeholder="filename.pl"
        className={`${styles.fileNameInputTiny} ${theme === 'dark' ? styles.fileNameInputDark : ''}`}
        disabled={isLoading || isLoadingDomain || !selectedDomain}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && fileNameInput.trim()) {
            sendQuery(`consult_file('${fileNameInput.trim()}').`);
            setFileNameInput("");
          }
        }}
      />
      <div className={styles.fileButtonsRow}>
        {fileCommands.map((cmd, idx) => (
          <button
            key={idx}
            onClick={cmd.action}
            disabled={isLoading || isLoadingDomain || !selectedDomain || !fileNameInput.trim()}
            className={styles.fileCommandButtonTiny}
            style={{ backgroundColor: cmd.color }}
            title={cmd.tooltip}
          >
            <i className={cmd.icon}></i>
          </button>
        ))}
      </div>
    </div>
  </div>
</div>

              {/* CHAT WINDOW */}
              {/* CHAT WINDOW */}
<div className={`${styles.chatWindow} ${theme === 'dark' ? styles.chatWindowDark : ''} ${isChatExpanded ? styles.chatExpanded : ''}`}>
  <div className={styles.chatHeader}>
    <div className={styles.chatHeaderLeft}>
      <h3>{t('prolog_chat') || 'Prolog Chat'}</h3>
      <span className={styles.messageCount}>
        {messages.filter(m => !m.user).length} {t('responses') || 'responses'}
      </span>
    </div>
    <div className={styles.chatHeaderRight}>
      <button 
        onClick={toggleChatExpansion}
        className={`${styles.expandButton} ${isChatExpanded ? styles.expanded : ''}`}
        title={isChatExpanded ? 
          (t('collapse_chat') || 'Collapse chat') : 
          (t('expand_chat') || 'Expand chat')}
      >
        <i className={`fas fa-${isChatExpanded ? 'compress' : 'expand'}`}></i>
      </button>
      <button 
        onClick={clearChat}
        className={styles.clearChatButtonSmall}
        title={t('clear_chat') || 'Clear chat'}
      >
        <i className="fas fa-trash"></i>
      </button>
    </div>
  </div>
  
  <div 
    ref={messagesContainerRef}
    className={`${styles.messagesContainer} ${theme === 'dark' ? styles.messagesContainerDark : ''} ${isChatExpanded ? styles.messagesContainerExpanded : ''}`}
  >
    {(messages.length === 0 ? [{ 
      user: false, 
      text: getWelcomeMessage(), 
      id: "welcome", 
      timestamp: new Date() 
    }] : messages).map(msg => (
      <div key={msg.id} className={`${styles.messageWrapper} ${msg.user ? styles.userMessage : styles.botMessage}`}>
        <div className={styles.messageContent}>
          {!msg.user && (
            <div className={styles.messageAvatar}>
              <div className={styles.userAvatar}>
                <img src="/images/logo_shevici.jpg" alt="AI Assistant" />
              </div>
            </div>
          )}
          <div className={`${styles.messageBubble} ${msg.id.startsWith('thinking-') || msg.id.startsWith('domain-loading-') ? styles.thinkingBubble : ''} ${theme === 'dark' ? styles.messageBubbleDark : ''}`}>
            <div className={`${styles.messageText} ${msg.id.startsWith('thinking-') || msg.id.startsWith('domain-loading-') ? styles.thinkingText : ''} ${theme === 'dark' ? styles.messageTextDark : ''}`}>
              {msg.text.split("\n").map((line, i) => (
                <div key={i} className={styles.messageLine}>
                  {line}
                </div>
              ))}
            </div>
            <div className={`${styles.messageTime} ${theme === 'dark' ? styles.messageTimeDark : ''}`}>
              {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          {msg.user && (
            <div className={styles.messageAvatar}>
              <div className={styles.userAvatar}>
                <i className="fas fa-user"></i>
              </div>
            </div>
          )}
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} className={styles.scrollAnchor} />
  </div>

  <div className={styles.inputContainer}>
    <form onSubmit={(e) => e.preventDefault()} className={styles.inputForm}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isLoadingDomain ? (t('loading_domain') || "Loading domain") + "..." :
            !selectedDomain ? (t('select_domain_first') || "Select a domain first") + "..." :
            `${t('enter_prolog_query') || "Enter Prolog query"} ${selectedDomain} ${t('domain') || "domain"}...`
          }
          className={`${styles.chatInput} ${theme === 'dark' ? styles.chatInputDark : ''}`}
          disabled={isLoading || isLoadingDomain || !selectedDomain}
        />
        <button
          type="button"
          onClick={() => sendQuery()}
          disabled={isLoading || isLoadingDomain || !query.trim() || !selectedDomain}
          className={`${styles.sendButton} ${theme === 'dark' ? styles.sendButtonDark : ''}`}
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i>
              <span className={styles.sendButtonText}>
                {t('send') || 'Send'}
              </span>
            </>
          )}
        </button>
      </div>
      <div className={`${styles.inputHint} ${theme === 'dark' ? styles.inputHintDark : ''}`}>
        <i className="fas fa-info-circle"></i>
        {t('press_enter_to_send') || 'Press Enter to send'} • 
        {selectedDomain && ` • ${t('connected_to') || 'Connected to'}: ${selectedDomain} ${t('domain') || 'domain'}`}
      </div>
    </form>
  </div>
</div>
</div>
          )}

          {/* CODE TAB */}
          {activeTab === "code" && (
            <div className={styles.codeSection}>
              <div className={`${styles.codeHeader} ${theme === 'dark' ? styles.codeHeaderDark : ''}`}>
                <h2 className={`${styles.codeTitle} ${theme === 'dark' ? styles.codeTitleDark : ''}`}>
                  <i className="fas fa-file-code"></i>
                  {t('code_preview') || 'Code Preview'} - {selectedDomain || t('no_domain_selected') || 'No Domain Selected'}
                  {selectedDomain && (
                    <span className={`${styles.codeDomainBadge} ${theme === 'dark' ? styles.codeDomainBadgeDark : ''}`}>
                      <i className="fas fa-tag"></i> {selectedDomain}
                    </span>
                  )}
                </h2>
                <div className={styles.codeStats}>
                  <div className={`${styles.codeStat} ${theme === 'dark' ? styles.codeStatDark : ''}`}>
                    <i className="fas fa-file"></i>
                    {getFilteredCodes().length} {t('files') || 'files'}
                  </div>
                  <div className={`${styles.codeStat} ${theme === 'dark' ? styles.codeStatDark : ''}`}>
                    <i className="fas fa-database"></i>
                    {selectedDomain || t('no_domain') || 'No domain'}
                  </div>
                </div>
              </div>

              <div className={`${styles.codeEditorContainer} ${theme === 'dark' ? styles.codeEditorContainerDark : ''}`}>
                {!selectedDomain ? (
                  <div className={`${styles.noCode} ${theme === 'dark' ? styles.noCodeDark : ''}`}>
                    <i className="fas fa-folder-open"></i>
                    <h3>{t('no_domain_selected') || 'No domain selected'}</h3>
                    <p>{t('select_domain_to_view') || 'Select a domain from the sidebar to view its code files.'}</p>
                  </div>
                ) : getFilteredCodes().length === 0 ? (
                  <div className={`${styles.noCode} ${theme === 'dark' ? styles.noCodeDark : ''}`}>
                    <i className="fas fa-file-code"></i>
                    <h3>{t('no_code_files_for') || 'No code files for'} {selectedDomain}</h3>
                    <p>{t('upload_code_for_domain') || 'Upload code files for this domain to see them here.'}</p>
                    <button 
                      className={`${styles.uploadButton} ${theme === 'dark' ? styles.uploadButtonDark : ''}`}
                      onClick={() => window.location.href = '/dashboard?tab=upload'}
                    >
                      <i className="fas fa-upload"></i>
                      {t('upload_code') || 'Upload Code'}
                    </button>
                  </div>
                ) : (
                  <div className={styles.codeFilesGrid}>
                    {getFilteredCodes().map(code => (
                      <div key={code.id} className={`${styles.codeFileCard} ${theme === 'dark' ? styles.codeFileCardDark : ''}`}>
                        <div className={styles.codeFileHeader}>
                          <div className={styles.codeFileIcon}>
                            <i className="fas fa-file-code"></i>
                          </div>
                          <div className={styles.codeFileTitle}>
                            <h4 className={theme === 'dark' ? styles.codeFileTitleDark : ''}>
                              {code.title || code.id}
                            </h4>
                            <div className={styles.codeFileMeta}>
                              <span className={`${styles.codeFileDomain} ${theme === 'dark' ? styles.codeFileDomainDark : ''}`}>
                                <i className="fas fa-tag"></i> {code.domain || 'general'}
                              </span>
                            </div>
                          </div>
                          <button 
                            className={`${styles.copyCodeButton} ${theme === 'dark' ? styles.copyCodeButtonDark : ''}`}
                            onClick={() => navigator.clipboard.writeText(code.code)}
                            title={t('copy_code') || 'Copy code'}
                          >
                            <i className="fas fa-copy"></i>
                          </button>
                        </div>
                        <div className={`${styles.codePreview} ${theme === 'dark' ? styles.codePreviewDark : ''}`}>
                          <pre className={`${styles.prologCode} ${theme === 'dark' ? styles.prologCodeDark : ''}`}>
                            <code dangerouslySetInnerHTML={{ __html: formatCode(code.code.substring(0, 200) + (code.code.length > 200 ? '...' : '')) }} />
                          </pre>
                        </div>
                        <div className={styles.codeFileActions}>
                          <button 
                            className={`${styles.viewFullButton} ${theme === 'dark' ? styles.viewFullButtonDark : ''}`}
                            onClick={() => {
                              const fullCodeWindow = window.open('', '_blank');
                              if (fullCodeWindow) {
                                fullCodeWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>${code.title || code.id} - Prolog Code</title>
                                      <style>
                                        body { 
                                          font-family: monospace; 
                                          padding: 20px; 
                                          background: ${theme === 'dark' ? '#1a1a1a' : '#f5f5f5'}; 
                                          color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
                                        }
                                        pre { 
                                          background: ${theme === 'dark' ? '#2d2d2d' : 'white'}; 
                                          padding: 20px; 
                                          border-radius: 5px; 
                                          color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
                                        }
                                        .comment { color: ${theme === 'dark' ? '#6a9955' : 'green'}; }
                                        .fact { color: ${theme === 'dark' ? '#569cd6' : 'blue'}; }
                                        .rule { color: ${theme === 'dark' ? '#c586c0' : 'purple'}; }
                                        .query { color: ${theme === 'dark' ? '#ce9178' : 'orange'}; }
                                      </style>
                                    </head>
                                    <body>
                                      <h2>${code.title || code.id}</h2>
                                      <pre>${code.code}</pre>
                                    </body>
                                  </html>
                                `);
                              }
                            }}
                          >
                            <i className="fas fa-external-link-alt"></i>
                            {t('view_full_code') || 'View Full Code'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}