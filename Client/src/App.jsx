import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from './components/DashBoard';   // ✅ use full Dashboard, not QRScanner
import Login from './page/login';

// API base
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt', token);
    } else {
      localStorage.removeItem('jwt');
    }
  }, [token]);

  if (!token) {
    return <Login onLogin={(t) => setToken(t)} apiBase={API_BASE} />;
  }

  // ✅ Render main dashboard with props
  return (
    <Dashboard
      apiBase={API_BASE}
      token={token}
      onLogout={() => setToken(null)}
    />
  );
}
