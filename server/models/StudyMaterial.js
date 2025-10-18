const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploaderName: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true,
    index: true
  },
  subtopics: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  downloads: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    downloadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  downloadsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'English'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better search performance
studyMaterialSchema.index({ topic: 1, uploadDate: -1 });
studyMaterialSchema.index({ title: 'text', description: 'text', tags: 'text' });
studyMaterialSchema.index({ likesCount: -1 });
studyMaterialSchema.index({ downloadsCount: -1 });

// Update lastModified before saving
studyMaterialSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

// Update counts when likes/downloads change
studyMaterialSchema.methods.updateCounts = function() {
  this.likesCount = this.likes.length;
  this.downloadsCount = this.downloads.length;
};

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);