const express = require('express');
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /progress - Get user's progress stats
router.get('/progress', auth, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.userId });
    
    if (!progress) {
      // Create initial progress record
      progress = new UserProgress({ userId: req.userId });
      await progress.save();
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress data' });
  }
});

// POST /progress/update - Update user's progress stats
router.post('/progress/update', auth, async (req, res) => {
  try {
    const { action, data } = req.body;
    
    let progress = await UserProgress.findOne({ userId: req.userId });
    
    if (!progress) {
      progress = new UserProgress({ userId: req.userId });
    }
    
    // Update based on action type
    switch (action) {
      case 'upload':
        progress.uploads += 1;
        break;
        
      case 'summary':
        progress.summaries += 1;
        break;
        
      case 'flashcard':
        progress.flashcardsReviewed += (data?.count || 1);
        break;
        
      case 'quiz':
        progress.quizzesAttempted += 1;
        if (data?.score !== undefined) {
          progress.totalQuizScore += data.score;
          progress.updateAverageScore();
        }
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action type' });
    }
    
    // Update last activity
    progress.lastActivity = new Date();
    
    // Check for new achievements
    const newAchievements = progress.checkAchievements();
    
    // Update study streak
    const today = new Date().toDateString();
    const lastActivity = new Date(progress.lastActivity).toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (lastActivity === today) {
      // Already studied today, no change to streak
    } else if (lastActivity === yesterday) {
      // Studied yesterday, increment streak
      progress.studyStreak += 1;
    } else {
      // Missed a day, reset streak
      progress.studyStreak = 1;
    }
    
    await progress.save();
    
    res.json({
      progress,
      newAchievements,
      message: newAchievements.length > 0 ? 'New achievements unlocked!' : 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress data' });
  }
});

// GET /progress/leaderboard - Get top performers (optional feature)
router.get('/progress/leaderboard', auth, async (req, res) => {
  try {
    const topPerformers = await UserProgress.find()
      .populate('userId', 'name')
      .sort({ avgScore: -1, quizzesAttempted: -1 })
      .limit(10)
      .select('userId avgScore quizzesAttempted studyStreak');
    
    res.json(topPerformers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

// POST /progress/goals - Update daily goals
router.post('/progress/goals', auth, async (req, res) => {
  try {
    const { goals } = req.body;
    
    let progress = await UserProgress.findOne({ userId: req.userId });
    
    if (!progress) {
      progress = new UserProgress({ userId: req.userId });
    }
    
    progress.dailyGoals = { ...progress.dailyGoals, ...goals };
    await progress.save();
    
    res.json({ message: 'Goals updated successfully', progress });
  } catch (error) {
    console.error('Error updating goals:', error);
    res.status(500).json({ error: 'Failed to update goals' });
  }
});

module.exports = router;