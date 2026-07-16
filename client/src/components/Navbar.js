import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { id: 'upload',    label: 'Upload',     icon: '↑' },
  { id: 'summary',   label: 'Summaries',  icon: '≡' },
  { id: 'flashcards',label: 'Flashcards', icon: '⟐' },
  { id: 'quiz',      label: 'Quiz',       icon: '?' },
  { id: 'community', label: 'Community',  icon: '⊕' },
  { id: 'progress',  label: 'Progress',   icon: '◉' },
];

const Navbar = ({ activeTab, setActiveTab, darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand" style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.4px' }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
          <rect width="28" height="28" rx="8" fill="url(#nb)" />
          <path d="M8 20L14 8l6 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 16h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="nb" x1="0" y1="0" x2="28" y2="28">
              <stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
        StudyAI
      </div>

      <ul className="navbar-nav" style={{ margin: 0 }}>
        {NAV_ITEMS.map(item => (
          <li
            key={item.id}
            className={`nav-item${activeTab === item.id ? ' active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </li>
        ))}

        <li>
          <button className="dark-mode-toggle" onClick={toggleDarkMode} title="Toggle theme">
            {darkMode ? '☀' : '◑'}
          </button>
        </li>

        <li className="user-info">
          <span className="user-name" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            {user?.name}
          </span>
          <button onClick={logout} className="btn btn-secondary logout-btn">
            Sign out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
