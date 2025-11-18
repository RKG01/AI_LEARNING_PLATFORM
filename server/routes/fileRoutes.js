const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const File = require('../models/File');
const Summary = require('../models/Summary');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
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
        fileSize: 50 * 1024 * 1024 // 50MB limit (increased from 10MB)
    }
});

// POST /upload - Upload and parse file
router.post('/upload', auth, (req, res) => {
    upload.single('file')(req, res, async (err) => {
        try {
            // Handle multer errors
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        error: 'File too large. Maximum size allowed is 50MB.'
                    });
                }
                if (err.message === 'Only PDF and text files are allowed') {
                    return res.status(400).json({
                        error: 'Invalid file type. Only PDF and text files are allowed.'
                    });
                }
                return res.status(400).json({
                    error: err.message || 'File upload error'
                });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            let content = '';

            if (req.file.mimetype === 'application/pdf') {
                const pdfData = await pdfParse(req.file.buffer);
                content = pdfData.text;

                if (!content || content.trim().length === 0) {
                    return res.status(400).json({
                        error: 'Could not extract text from PDF. Please ensure the PDF contains readable text.'
                    });
                }
            } else {
                content = req.file.buffer.toString('utf-8');

                if (!content || content.trim().length === 0) {
                    return res.status(400).json({
                        error: 'The text file appears to be empty.'
                    });
                }
            }

            const file = new File({
                userId: req.userId,
                filename: req.file.filename || `${Date.now()}-${req.file.originalname}`,
                originalName: req.file.originalname,
                content: content
            });

            await file.save();

            res.json({
                message: 'File uploaded successfully',
                fileId: file._id,
                filename: file.originalName,
                size: req.file.size,
                contentLength: content.length
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                error: 'Failed to process file. Please try again.'
            });
        }
    });
});

// GET /files - Get all uploaded files for the authenticated user with pagination
router.get('/files', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination info
        const totalFiles = await File.countDocuments({ userId: req.userId });
        
        // Get paginated files
        const files = await File.find(
            { userId: req.userId }, 
            'filename originalName uploadDate'
        )
        .sort({ uploadDate: -1 })
        .skip(skip)
        .limit(limit);

        // Calculate pagination info
        const totalPages = Math.ceil(totalFiles / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            files,
            pagination: {
                currentPage: page,
                totalPages,
                totalFiles,
                hasNextPage,
                hasPrevPage,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// GET /summary/:fileId - Generate or retrieve summary
router.get('/summary/:fileId', auth, async (req, res) => {
    try {
        const { fileId } = req.params;

        // Check if file belongs to user
        const file = await File.findOne({ _id: fileId, userId: req.userId });
        if (!file) {
            return res.status(404).json({ error: 'File not found or access denied' });
        }

        // Check if summary already exists
        let summary = await Summary.findOne({ fileId, userId: req.userId });

        if (!summary) {
            // Generate new summary
            const summaryData = await geminiService.generateSummary(file.content);

            summary = new Summary({
                userId: req.userId,
                fileId: fileId,
                content: summaryData.summary,
                topics: summaryData.topics || []
            });

            await summary.save();
        }

        res.json(summary);
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
});

// GET /flashcards/:fileId - Generate or retrieve flashcards
router.get('/flashcards/:fileId', auth, async (req, res) => {
    try {
        const { fileId } = req.params;

        // Check if file belongs to user
        const file = await File.findOne({ _id: fileId, userId: req.userId });
        if (!file) {
            return res.status(404).json({ error: 'File not found or access denied' });
        }

        let flashcards = await Flashcard.findOne({ fileId, userId: req.userId });

        if (!flashcards) {
            const cards = await geminiService.generateFlashcards(file.content);

            flashcards = new Flashcard({
                userId: req.userId,
                fileId: fileId,
                cards: cards
            });

            await flashcards.save();
        }

        res.json(flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({ error: 'Failed to generate flashcards' });
    }
});

// GET /quiz/:fileId - Generate or retrieve quiz
router.get('/quiz/:fileId', auth, async (req, res) => {
    try {
        const { fileId } = req.params;
        const numQuestions = parseInt(req.query.questions) || 20; // Default 20 questions

        // Check if file belongs to user
        const file = await File.findOne({ _id: fileId, userId: req.userId });
        if (!file) {
            return res.status(404).json({ error: 'File not found or access denied' });
        }

        // Check if quiz exists with the same number of questions
        let quiz = await Quiz.findOne({
            fileId,
            userId: req.userId,
            'questions.length': { $gte: numQuestions }
        });

        if (!quiz) {
            const questions = await geminiService.generateQuiz(file.content, numQuestions);

            quiz = new Quiz({
                userId: req.userId,
                fileId: fileId,
                questions: questions
            });

            await quiz.save();
        } else if (quiz.questions.length > numQuestions) {
            // If we have more questions than requested, return only the requested number
            quiz = {
                ...quiz.toObject(),
                questions: quiz.questions.slice(0, numQuestions)
            };
        }

        res.json(quiz);
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

module.exports = router;