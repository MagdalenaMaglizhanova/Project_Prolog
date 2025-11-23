import _React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrologChat from './pages/PrologChat';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Симулираме зареждане
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className="app"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
        }}
      >
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        
        {/* Динамичен Prolog Chat Route */}
        <Route path="/chat/:codeId?" element={<Layout><PrologChat /></Layout>} />
        
        {/* Допълнителни routes */}
        <Route path="/topics" element={<Layout><Home /></Layout>} />
        <Route path="/submissions" element={<Layout><Home /></Layout>} />
      </Routes>
    </div>
  );
}

export default App;