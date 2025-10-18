import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Fetch progress data
  const fetchProgress = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/progress`);
      setProgress(response.data);
      setAchievements(response.data.achievements || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update progress
  const updateProgress = async (action, data = {}) => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/progress/update`, {
        action,
        data
      });

      setProgress(response.data.progress);
      
      // Handle new achievements
      if (response.data.newAchievements && response.data.newAchievements.length > 0) {
        setAchievements(prev => [...prev, ...response.data.newAchievements]);
        
        // Show achievement notification
        response.data.newAchievements.forEach(achievement => {
          showAchievementNotification(achievement);
        });
      }

      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  // Show achievement notification
  const showAchievementNotification = (achievement) => {
    // Create a beautiful notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
          <h4>🎉 Achievement Unlocked!</h4>
          <p><strong>${achievement.name}</strong></p>
          <p>${achievement.description}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  };

  // Calculate progress percentages
  const getProgressPercentages = () => {
    if (!progress) return {};

    const goals = progress.dailyGoals;
    return {
      uploads: Math.min((progress.uploads / goals.uploads) * 100, 100),
      summaries: Math.min((progress.summaries / goals.summaries) * 100, 100),
      flashcards: Math.min((progress.flashcardsReviewed / goals.flashcards) * 100, 100),
      quizzes: Math.min((progress.quizzesAttempted / goals.quizzes) * 100, 100)
    };
  };

  // Get motivational message
  const getMotivationalMessage = () => {
    if (!progress) return "Welcome to your learning journey! 🌟";

    const totalActivities = progress.uploads + progress.summaries + progress.flashcardsReviewed + progress.quizzesAttempted;
    const avgScore = progress.avgScore;

    if (totalActivities === 0) {
      return "Ready to start learning? Upload your first file! 👩‍💻";
    } else if (totalActivities < 10) {
      return "Great start! Keep exploring the platform! 🚀";
    } else if (avgScore >= 90) {
      return "Outstanding performance! You're a learning superstar! ⭐";
    } else if (avgScore >= 80) {
      return "Excellent work! You're mastering the material! 👩‍🎓";
    } else if (avgScore >= 70) {
      return "Good progress! Keep practicing to improve! 💪";
    } else if (progress.studyStreak >= 7) {
      return "Amazing dedication! Your study streak is inspiring! 🔥";
    } else {
      return "Every step counts! You're building great habits! 🌸";
    }
  };

  // Get level and XP (gamification)
  const getLevelInfo = () => {
    if (!progress) return { level: 1, xp: 0, nextLevelXP: 100 };

    const totalXP = (progress.uploads * 10) + 
                   (progress.summaries * 15) + 
                   (progress.flashcardsReviewed * 2) + 
                   (progress.quizzesAttempted * 25) +
                   (progress.avgScore * 2);

    const level = Math.floor(totalXP / 100) + 1;
    const currentLevelXP = totalXP % 100;
    const nextLevelXP = 100;

    return { level, xp: currentLevelXP, nextLevelXP, totalXP };
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProgress();
    } else {
      setProgress(null);
      setAchievements([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const value = {
    progress,
    loading,
    achievements,
    updateProgress,
    fetchProgress,
    getProgressPercentages,
    getMotivationalMessage,
    getLevelInfo
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};