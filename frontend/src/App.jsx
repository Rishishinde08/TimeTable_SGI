import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import AdminLogin from './components/AdminLogin.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import TimetableTable from './components/TimetableTable.jsx';
import "./index.css";
import Footer from './footer.jsx';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen p-4">
      <header className="navbar">
        <Link to="/" className="logo">Timetable</Link>

        {/* Hamburger Button */}
        <div
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation */}
        <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>View</Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<TimetableTable />} />
        <Route
          path="/admin"
          element={<AdminLogin onToken={(t) => {
            localStorage.setItem('jwt', t);
            setToken(t);
          }} />}
        />
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </div>
  );
}
