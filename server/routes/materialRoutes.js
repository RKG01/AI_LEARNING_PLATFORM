const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const StudyMaterial = require('../models/StudyMaterial');
const User = require('../models/User');
const geminiService = require('../services/geminiService');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// POST /api/materials/upload - Upload study material
router.post('/materials/upload', auth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'File too large. Maximum size allowed is 50MB.'
          });
        }
        return res.status(400).json({
          error: err.message || 'File upload error'
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      let content = '';

      // Extract text content
      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        content = pdfData.text;
      } else {
        content = req.file.buffer.toString('utf-8');
      }

      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          error: 'Could not extract readable content from the file.'
        });
      }

      // Use Gemini API to categorize the content
      const categorizationPrompt = `
        Analyze the following educational content and provide categorization information.
        Return a JSON object with this structure:
        {
          "topic": "main subject category (e.g., Mathematics, Computer Science, Biology)",
          "subtopics": ["specific subtopic 1", "specific subtopic 2"],
          "difficulty": "Beginner|Intermediate|Advanced",
          "tags": ["relevant", "keywords", "for", "search"]
        }
        
        Content to analyze:
        ${content.substring(0, 3000)}...
      `;

      let categorization;
      try {
        const geminiResponse = await geminiService.generateContent(categorizationPrompt);
        categorization = JSON.parse(geminiResponse);
      } catch (error) {
        console.error('Gemini categorization error:', error);
        // Fallback categorization
        categorization = {
          topic: 'General Studies',
          subtopics: ['Educational Material'],
          difficulty: 'Intermediate',
          tags: ['study', 'notes', 'education']
        };
      }

      // Get user info
      const user = await User.findById(req.userId);

      // Create study material
      const studyMaterial = new StudyMaterial({
        title,
        description: description || '',
        uploaderId: req.userId,
        uploaderName: user.name,
        filename: `${Date.now()}-${req.file.originalname}`,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        content,
        topic: categorization.topic,
        subtopics: categorization.subtopics || [],
        difficulty: categorization.difficulty || 'Intermediate',
        tags: categorization.tags || []
      });

      await studyMaterial.save();

      res.json({
        message: 'Study material uploaded successfully',
        material: {
          id: studyMaterial._id,
          title: studyMaterial.title,
          topic: studyMaterial.topic,
          difficulty: studyMaterial.difficulty,
          uploaderName: studyMaterial.uploaderName
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        error: 'Failed to upload study material. Please try again.'
      });
    }
  });
});

// GET /api/materials - Get all study materials with filtering and search
router.get('/materials', async (req, res) => {
  try {
    const {
      topic,
      difficulty,
      search,
      sortBy = 'uploadDate',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    let query = { isPublic: true, isApproved: true };

    if (topic && topic !== 'all') {
      query.topic = new RegExp(topic, 'i');
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const materials = await StudyMaterial.find(query)
      .select('-content') // Exclude content for performance
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('uploaderId', 'name');

    // Get total count for pagination
    const totalCount = await StudyMaterial.countDocuments(query);

    // Get unique topics for filtering
    const topics = await StudyMaterial.distinct('topic', { isPublic: true, isApproved: true });

    res.json({
      materials,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + materials.length < totalCount,
        hasPrev: parseInt(page) > 1
      },
      topics: topics.sort()
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch study materials' });
  }
});

// POST /api/materials/:id/like - Like/unlike a material
router.post('/materials/:id/like', auth, async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    // Check if user already liked this material
    const existingLikeIndex = material.likes.findIndex(
      like => like.userId.toString() === req.userId.toString()
    );

    if (existingLikeIndex > -1) {
      // Unlike - remove the like
      material.likes.splice(existingLikeIndex, 1);
    } else {
      // Like - add the like
      material.likes.push({ userId: req.userId });
    }

    material.updateCounts();
    await material.save();

    res.json({
      message: existingLikeIndex > -1 ? 'Material unliked' : 'Material liked',
      likesCount: material.likesCount,
      isLiked: existingLikeIndex === -1
    });
  } catch (error) {
    console.error('Error liking material:', error);
    res.status(500).json({ error: 'Failed to like material' });
  }
});

// GET /api/materials/:id/download - Download a material
router.get('/materials/:id/download', auth, async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    // Add download record
    const existingDownload = material.downloads.find(
      download => download.userId.toString() === req.userId.toString()
    );

    if (!existingDownload) {
      material.downloads.push({ userId: req.userId });
      material.updateCounts();
      await material.save();
    }

    // Return file content for download
    res.json({
      filename: material.originalName,
      content: material.content,
      fileType: material.fileType,
      title: material.title
    });
  } catch (error) {
    console.error('Error downloading material:', error);
    res.status(500).json({ error: 'Failed to download material' });
  }
});

module.exports = router;