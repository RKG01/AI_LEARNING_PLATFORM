# 👩‍🎓 Personalized Learning Platform

A comprehensive full-stack web application that transforms your PDF documents and text files into interactive learning materials using AI. Upload your study materials and get AI-generated summaries, flashcards, quizzes, plus share knowledge with the community and track your learning progress with detailed analytics.

## 🎬 Demo Video

> **See the platform in action!** Watch our comprehensive demo showcasing all features:

### 🎥 **Choose Your Preferred Platform:**

[![YouTube Demo](https://img.shields.io/badge/▶️_Watch_on_YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/QdaeE-z0G-Q)
[![Google Drive Demo](https://img.shields.io/badge/▶️_Watch_on_Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1KVxm6tj6qO7KXTkJBTL2mUTb1dyvjLsW/view?usp=sharing)

### 📺 **Quick Access Links:**
- **[🎬 YouTube](https://youtu.be/QdaeE-z0G-Q)** - Stream instantly with comments and sharing
- **[🎥 Google Drive](https://drive.google.com/file/d/1KVxm6tj6qO7KXTkJBTL2mUTb1dyvjLsW/view?usp=sharing)** - High quality download option
- **[📱 Mobile Optimized](https://youtu.be/QdaeE-z0G-Q)** - Best experience on mobile devices

### 🌟 What you'll see in the demo:
- **👩‍💻 User Authentication** - Secure login and registration with beautiful UI
- **📁 File Upload** - Drag-and-drop PDF/text file upload with real-time validation
- **👩‍🏫 AI Summaries** - Intelligent topic-wise content summarization with voice narration
- **👧 Interactive Flashcards** - 3D flip animations with Q&A study cards
- **👩‍🎓 Smart Quizzes** - Customizable multiple-choice questions (10-25 questions)
- **👥 Community Library** - Share and discover study materials with other learners
- **� Prsogress Analytics** - Detailed learning statistics with beautiful charts
- **🎨 Kawaii UI** - Stunning glassmorphism design with anime-inspired elements
- **📱 Responsive Design** - Seamless experience across all devices

---

## ✨ Features

### 🎯 **Core Learning Features**
- **�‍💻 Smartt File Upload**: Drag-and-drop support for PDF and text files (up to 50MB)
- **👩‍�  AI-Powered Summaries**: Topic-wise content analysis using Google Gemini API with voice narration
- **� InterAactive Flashcards**: 3D flip animations with 15-25 AI-generated study cards
- **👩‍🎓 Customizable Quizzes**: Multiple-choice questions (10/15/20/25 options) with instant feedback
- **🔐 User Authentication**: Secure JWT-based login with personal data isolation

### 👥 **Community Features**
- **📚 Community Library**: Share your study materials with other learners
- **� RSmart Search & Filtering**: Find materials by topic, difficulty level, and keywords
- **❤️ Like & Download System**: Engage with community content and track popularity
- **🏷️ AI Categorization**: Automatic topic and difficulty classification for uploaded materials
- **� Communnity Stats**: View likes, downloads, and engagement metrics

### 📈 **Progress Tracking & Analytics**
- **� Leearning Dashboard**: Comprehensive overview of your study progress
- **📈 Interactive Charts**: Beautiful visualizations using Chart.js
- **🎯 Study Statistics**: Track quiz scores, flashcard reviews, and time spent
- **📅 Progress Timeline**: Monitor your learning journey over time
- **🏆 Achievement Tracking**: Celebrate milestones and learning goals

### 🎨 **Beautiful UI/UX**
- **✨ Kawaii Glassmorphism**: Stunning translucent cards with backdrop blur effects
- **🌈 Color Palette**: Dark purple, orange, and black with sky blue cursive text
- **🎭 Anime Characters**: Cute mascots and emojis throughout the interface
- **📱 Responsive Design**: Seamless experience on desktop, tablet, and mobile
- **🌙 Dark Theme**: Elegant dark mode with glowing effects and smooth animations
- **🔊 Voice Features**: Text-to-speech narration for summaries and content

### 🚀 **Technical Excellence**
- **💾 Data Persistence**: All content saved in MongoDB with user association
- **⚡ Performance**: Optimized loading with caching and smart API calls
- **🔒 Security**: Password hashing, JWT tokens, input validation, and secure file handling
- **🎯 Error Handling**: Graceful fallbacks and user-friendly error messages
- **🌐 RESTful API**: Well-structured backend with comprehensive endpoints

## �️ Trech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Multer** for file uploads and processing
- **PDF-Parse** for PDF text extraction
- **Google Gemini API** for AI content generation and categorization
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **React** with functional components and hooks
- **Context API** for state management (Auth, Progress)
- **Axios** for API communication
- **Chart.js** with react-chartjs-2 for analytics visualization
- **CSS3** with modern styling, animations, and glassmorphism effects
- **Web Speech API** for voice narration features
- **Responsive design** with mobile-first approach

## 🚀 Quick Start

### 📋 Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or cloud instance)
- **Google Gemini API key** ([Get it here](https://makersuite.google.com/app/apikey))

### ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personalized-learning-platform
   ```

2. **Install all dependencies**
   ```bash
   # Install backend dependencies
   cd server && npm install
   
   # Install frontend dependencies
   cd ../client && npm install
   ```

3. **Configure environment variables**
   
   **Backend** (`server/.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/learning-platform
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=your_secure_jwt_secret_key_here
   ```
   
   **Frontend** (`client/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend  
   cd client && npm start
   ```

5. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

### 🎯 First Steps
1. **Create an account** - Register with your name, email, and password
2. **Upload a file** - Drag and drop a PDF or text file
3. **Generate content** - Get AI-powered summaries, flashcards, and quizzes
4. **Explore community** - Share your materials and discover others' content
5. **Track progress** - Monitor your learning analytics and achievements
6. **Start learning** - Use all the interactive study tools!

## � How Gto Use

### 🎯 **Step-by-Step Guide**

1. **👩‍💼 Create Account**
   - Register with your name, email, and secure password
   - Login to access your personal learning dashboard

2. **👩‍💻 Upload Learning Materials**
   - Navigate to the Upload tab
   - Drag-and-drop or click to select PDF/text files (up to 50MB)
   - Watch real-time upload progress and AI categorization

3. **👩‍🏫 Generate AI Summaries**
   - Select an uploaded file from your library
   - Go to the Summaries tab
   - Get comprehensive topic-wise summaries with voice narration
   - Use play/pause controls for audio learning

4. **👧 Study with Interactive Flashcards**
   - Access the Flashcards tab for your selected file
   - Enjoy 3D flip animations with Q&A cards
   - Navigate through 15-25 AI-generated study cards
   - Track your review progress

5. **👩‍🎓 Take Smart Quizzes**
   - Choose the Quiz tab for knowledge testing
   - Select 10, 15, 20, or 25 questions
   - Get instant feedback with detailed answer explanations
   - View your score and performance analytics

6. **👥 Explore Community Library**
   - Browse shared study materials from other learners
   - Search by topic, difficulty, or keywords
   - Like helpful materials and download for offline study
   - Share your own materials to help others

7. **📊 Track Your Progress**
   - Visit the Progress tab for detailed analytics
   - View interactive charts of your learning journey
   - Monitor quiz scores, study time, and achievements
   - Set and track learning goals

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### File Management
- `POST /api/upload` - Upload and parse PDF/text files
- `GET /api/files` - Retrieve list of uploaded files
- `DELETE /api/files/:id` - Delete uploaded file

### AI-Generated Content
- `GET /api/summary/:fileId` - Generate or retrieve file summary
- `GET /api/flashcards/:fileId` - Generate or retrieve flashcards
- `GET /api/quiz/:fileId` - Generate or retrieve quiz questions

### Community Features
- `GET /api/materials` - Get community materials with filtering
- `POST /api/materials/upload` - Share material with community
- `POST /api/materials/:id/like` - Like/unlike material
- `GET /api/materials/:id/download` - Download community material

### Progress Tracking
- `GET /api/progress/stats` - Get user progress statistics
- `POST /api/progress/quiz` - Record quiz completion
- `POST /api/progress/study` - Record study session
- `GET /api/progress/analytics` - Get detailed analytics data

## 🎨 Features in Detail

### File Upload & AI Processing
- Supports PDF and plain text files up to 50MB
- Drag-and-drop interface with progress indicators
- AI-powered content extraction and categorization
- Automatic topic and difficulty level detection

### AI Summaries with Voice Narration
- Topic-wise content organization using Gemini AI
- Key concepts extraction and structured presentation
- Built-in text-to-speech with play/pause controls
- Cached for optimal performance

### Interactive Flashcards
- Beautiful 3D flip animations
- AI-generated question-answer pairs
- Navigation controls with progress tracking
- Mobile-friendly touch interactions

### Smart Quizzes
- Customizable question count (10-25 questions)
- Multiple-choice format with instant feedback
- Detailed explanations for each answer
- Score tracking and performance analytics

### Community Library
- Share and discover study materials
- Advanced search and filtering system
- Like/download engagement features
- AI-powered categorization and tagging

### Progress Analytics
- Interactive charts using Chart.js
- Study time tracking and goal setting
- Quiz performance over time
- Achievement system and milestones

### Kawaii UI Design
- Glassmorphism effects with backdrop blur
- Anime-inspired color scheme and emojis
- Smooth animations and transitions
- Responsive design for all devices

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the React app: `cd client && npm run build`
2. Deploy the `build` folder to your hosting platform
3. Set environment variable: `REACT_APP_API_URL=your-backend-url`

### Backend (Render/Heroku/Railway)
1. Deploy the `server` folder
2. Set environment variables:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `PORT` (automatically set by hosting platform)

## 🔐 Environment Variables

### Required Backend Variables
- `MONGODB_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini API key for AI features
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 5000)

### Required Frontend Variables
- `REACT_APP_API_URL`: Backend API base URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or check your cloud connection string
- Verify network connectivity and firewall settings

**Gemini API Error:**
- Check your API key is valid and has sufficient quota
- Ensure the API key has proper permissions

**File Upload Issues:**
- Check file size (must be under 50MB)
- Ensure file format is PDF or plain text
- Verify server has write permissions

**Authentication Issues:**
- Check JWT_SECRET is set in environment variables
- Verify token expiration and refresh logic
- Clear browser localStorage if needed

**CORS Errors:**
- Ensure backend CORS is properly configured
- Check frontend API URL matches backend address

**Voice Narration Not Working:**
- Check browser compatibility with Web Speech API
- Ensure HTTPS connection for production
- Verify audio permissions in browser settings

## 🔮 Future Enhancements

- [ ] Mobile app development (React Native)
- [ ] Real-time collaborative study sessions
- [ ] Advanced spaced repetition algorithm
- [ ] Support for more file formats (DOCX, PPTX, EPUB)
- [ ] Video content integration and transcription
- [ ] Gamification with badges and leaderboards
- [ ] AI-powered study recommendations
- [ ] Export functionality (PDF, Anki cards)
- [ ] Offline mode with PWA capabilities
- [ ] Multi-language support and translation

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy Learning! 🎓✨**

*Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI*