import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import SummaryView from './components/SummaryView';
import FlashcardView from './components/FlashcardView';
import QuizView from './components/QuizView';
import ProgressAnalytics from './components/ProgressAnalytics';
import CommunityLibrary from './components/CommunityLibrary';
import DebugInfo from './components/DebugInfo';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="main-content">
        {activeTab === 'upload' && (
          <div>
            <FileUpload />
            <FileList 
              onFileSelect={setSelectedFileId}
              selectedFileId={selectedFileId}
            />
          </div>
        )}
        
        {activeTab === 'summary' && (
          <SummaryView fileId={selectedFileId} />
        )}
        
        {activeTab === 'flashcards' && (
          <FlashcardView fileId={selectedFileId} />
        )}
        
        {activeTab === 'quiz' && (
          <QuizView fileId={selectedFileId} />
        )}
        
        {activeTab === 'community' && (
          <CommunityLibrary />
        )}
        
        {activeTab === 'progress' && (
          <ProgressAnalytics />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <MainApp />
        <DebugInfo />
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
