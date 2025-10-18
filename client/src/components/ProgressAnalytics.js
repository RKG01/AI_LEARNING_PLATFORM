import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useProgress } from '../contexts/ProgressContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProgressAnalytics = () => {
  const { progress, loading, achievements, getProgressPercentages, getMotivationalMessage, getLevelInfo } = useProgress();

  if (loading) {
    return (
      <div className="progress-analytics">
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="progress-analytics">
        <div className="card">
          <h2>📊 Progress & Analytics</h2>
          <div className="empty-state">
            <p>Start your learning journey to see your progress!</p>
          </div>
        </div>
      </div>
    );
  }

  const percentages = getProgressPercentages();
  const motivationalMessage = getMotivationalMessage();
  const levelInfo = getLevelInfo();

  // Chart data
  const activityData = {
    labels: ['Uploads', 'Summaries', 'Flashcards', 'Quizzes'],
    datasets: [
      {
        label: 'Activities Completed',
        data: [progress.uploads, progress.summaries, progress.flashcardsReviewed, progress.quizzesAttempted],
        backgroundColor: [
          'rgba(107, 70, 193, 0.8)',
          'rgba(234, 88, 12, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: [
          'rgba(107, 70, 193, 1)',
          'rgba(234, 88, 12, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(251, 146, 60, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const progressData = {
    labels: ['Uploads', 'Summaries', 'Flashcards', 'Quizzes'],
    datasets: [
      {
        label: 'Daily Goal Progress (%)',
        data: [percentages.uploads, percentages.summaries, percentages.flashcards, percentages.quizzes],
        backgroundColor: 'rgba(135, 206, 235, 0.8)',
        borderColor: 'rgba(135, 206, 235, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const scoreData = {
    labels: ['Current Score', 'Remaining'],
    datasets: [
      {
        data: [progress.avgScore, 100 - progress.avgScore],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(229, 231, 235, 0.3)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(229, 231, 235, 0.5)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#87CEEB',
          font: {
            family: 'Dancing Script',
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#87CEEB',
        bodyColor: '#87CEEB',
        borderColor: '#87CEEB',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#87CEEB',
          font: {
            family: 'Inter',
          },
        },
        grid: {
          color: 'rgba(135, 206, 235, 0.2)',
        },
      },
      x: {
        ticks: {
          color: '#87CEEB',
          font: {
            family: 'Inter',
          },
        },
        grid: {
          color: 'rgba(135, 206, 235, 0.2)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#87CEEB',
        bodyColor: '#87CEEB',
        borderColor: '#87CEEB',
        borderWidth: 1,
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="progress-analytics">
      {/* Header with Level and Motivational Message */}
      <div className="progress-header card">
        <div className="level-info">
          <div className="level-badge">
            <span className="level-number">Level {levelInfo.level}</span>
            <div className="xp-bar">
              <div 
                className="xp-fill" 
                style={{ width: `${(levelInfo.xp / levelInfo.nextLevelXP) * 100}%` }}
              ></div>
            </div>
            <span className="xp-text">{levelInfo.xp}/{levelInfo.nextLevelXP} XP</span>
          </div>
        </div>
        
        <div className="motivational-message">
          <h2>📊 Progress & Analytics</h2>
          <p className="motivation-text">{motivationalMessage}</p>
        </div>

        <div className="study-streak">
          <div className="streak-info">
            <span className="streak-number">{progress.studyStreak}</span>
            <span className="streak-label">Day Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card card">
          <div className="stat-icon">👩‍💻</div>
          <div className="stat-info">
            <h3>{progress.uploads}</h3>
            <p>Files Uploaded</p>
            <div className="progress-bar">
              <div 
                className="progress-fill uploads" 
                style={{ width: `${percentages.uploads}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">👩‍🏫</div>
          <div className="stat-info">
            <h3>{progress.summaries}</h3>
            <p>Summaries Generated</p>
            <div className="progress-bar">
              <div 
                className="progress-fill summaries" 
                style={{ width: `${percentages.summaries}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">👧</div>
          <div className="stat-info">
            <h3>{progress.flashcardsReviewed}</h3>
            <p>Flashcards Reviewed</p>
            <div className="progress-bar">
              <div 
                className="progress-fill flashcards" 
                style={{ width: `${percentages.flashcards}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">👩‍🎓</div>
          <div className="stat-info">
            <h3>{progress.quizzesAttempted}</h3>
            <p>Quizzes Completed</p>
            <div className="progress-bar">
              <div 
                className="progress-fill quizzes" 
                style={{ width: `${percentages.quizzes}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card card">
          <h3>📈 Activity Overview</h3>
          <div className="chart-container">
            <Bar data={activityData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card card">
          <h3>🎯 Daily Goal Progress</h3>
          <div className="chart-container">
            <Line data={progressData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card card score-chart">
          <h3>⭐ Average Quiz Score</h3>
          <div className="chart-container">
            <div className="doughnut-container">
              <Doughnut data={scoreData} options={doughnutOptions} />
              <div className="score-overlay">
                <span className="score-number">{progress.avgScore.toFixed(1)}%</span>
                <span className="score-label">Average</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="achievements-section card">
          <h3>🏆 Achievements</h3>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-details">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  <span className="achievement-date">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressAnalytics;