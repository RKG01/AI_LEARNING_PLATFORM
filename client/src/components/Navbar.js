import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ activeTab, setActiveTab, darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  
  const navItems = [
    { id: 'upload', label: 'Upload' },
    { id: 'summary', label: 'Summaries' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'community', label: 'Community' },
    { id: 'progress', label: 'Progress' }
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        👩‍🎓 Learning Platform
      </div>
      
      <ul className="navbar-nav">
        {navItems.map(item => (
          <li 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </li>
        ))}
        
        <li>
          <button 
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </li>

        <li className="user-info">
          <span className="user-name">👤 {user?.name}</span>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary logout-btn"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;