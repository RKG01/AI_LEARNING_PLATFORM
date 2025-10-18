const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  uploads: {
    type: Number,
    default: 0
  },
  summaries: {
    type: Number,
    default: 0
  },
  flashcardsReviewed: {
    type: Number,
    default: 0
  },
  quizzesAttempted: {
    type: Number,
    default: 0
  },
  totalQuizScore: {
    type: Number,
    default: 0
  },
  avgScore: {
    type: Number,
    default: 0
  },
  studyStreak: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  dailyGoals: {
    uploads: { type: Number, default: 3 },
    summaries: { type: Number, default: 5 },
    flashcards: { type: Number, default: 20 },
    quizzes: { type: Number, default: 2 }
  },
  achievements: [{
    name: String,
    description: String,
    unlockedAt: { type: Date, default: Date.now },
    icon: String
  }],
  weeklyStats: [{
    week: String,
    uploads: Number,
    summaries: Number,
    flashcards: Number,
    quizzes: Number,
    avgScore: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average score
userProgressSchema.methods.updateAverageScore = function() {
  if (this.quizzesAttempted > 0) {
    this.avgScore = Math.round((this.totalQuizScore / this.quizzesAttempted) * 100) / 100;
  }
};

// Check for new achievements
userProgressSchema.methods.checkAchievements = function() {
  const newAchievements = [];
  
  // First upload achievement
  if (this.uploads === 1 && !this.achievements.find(a => a.name === 'First Steps')) {
    newAchievements.push({
      name: 'First Steps',
      description: 'Uploaded your first learning material! 🎉',
      icon: '👩‍💻'
    });
  }
  
  // Quiz master achievement
  if (this.quizzesAttempted >= 10 && !this.achievements.find(a => a.name === 'Quiz Master')) {
    newAchievements.push({
      name: 'Quiz Master',
      description: 'Completed 10 quizzes! You\'re on fire! 🔥',
      icon: '👩‍🎓'
    });
  }
  
  // Perfect score achievement
  if (this.avgScore >= 90 && this.quizzesAttempted >= 5 && !this.achievements.find(a => a.name === 'Perfectionist')) {
    newAchievements.push({
      name: 'Perfectionist',
      description: 'Maintained 90%+ average score! Amazing! ⭐',
      icon: '👑'
    });
  }
  
  // Study streak achievement
  if (this.studyStreak >= 7 && !this.achievements.find(a => a.name === 'Week Warrior')) {
    newAchievements.push({
      name: 'Week Warrior',
      description: 'Studied for 7 days straight! Incredible dedication! 💪',
      icon: '🏆'
    });
  }
  
  // Flashcard enthusiast
  if (this.flashcardsReviewed >= 100 && !this.achievements.find(a => a.name === 'Flashcard Fanatic')) {
    newAchievements.push({
      name: 'Flashcard Fanatic',
      description: 'Reviewed 100 flashcards! Memory master! 🧠',
      icon: '👧'
    });
  }
  
  this.achievements.push(...newAchievements);
  return newAchievements;
};

module.exports = mongoose.model('UserProgress', userProgressSchema);