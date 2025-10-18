import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CommunityLibrary = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [topics, setTopics] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [pagination, setPagination] = useState({});
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null
  });

  const { user } = useAuth();

  // Fetch materials
  const fetchMaterials = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
        sortOrder: 'desc'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);

      const response = await axios.get(`${API_BASE_URL}/materials?${params}`);
      setMaterials(response.data.materials);
      setTopics(response.data.topics);
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [searchTerm, selectedTopic, selectedDifficulty, sortBy]);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title) {
      setError('Please provide both title and file');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);

    try {
      await axios.post(`${API_BASE_URL}/materials/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadForm({ title: '', description: '', file: null });
      setShowUploadForm(false);
      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  // Handle like/unlike
  const handleLike = async (materialId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/materials/${materialId}/like`);
      
      // Update the material in the list
      setMaterials(prev => prev.map(material => 
        material._id === materialId 
          ? { ...material, likesCount: response.data.likesCount, isLiked: response.data.isLiked }
          : material
      ));
    } catch (err) {
      console.error('Error liking material:', err);
    }
  };

  // Handle download
  const handleDownload = async (materialId, title) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/materials/${materialId}/download`);
      
      // Create and trigger download
      const blob = new Blob([response.data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Update download count in UI
      setMaterials(prev => prev.map(material => 
        material._id === materialId 
          ? { ...material, downloadsCount: material.downloadsCount + 1 }
          : material
      ));
    } catch (err) {
      console.error('Error downloading material:', err);
      setError('Failed to download material');
    }
  }; 
 const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTopicEmoji = (topic) => {
    const topicEmojis = {
      'Mathematics': '🔢',
      'Computer Science': '💻',
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'Biology': '🧬',
      'History': '📚',
      'Literature': '📖',
      'Art': '🎨',
      'Music': '🎵',
      'Language': '🗣️',
      'Business': '💼',
      'Economics': '📈',
      'Psychology': '🧠',
      'Philosophy': '🤔',
      'Engineering': '⚙️'
    };
    return topicEmojis[topic] || '📝';
  };

  return (
    <div className="community-library">
      {/* Header */}
      <div className="library-header card">
        <div className="header-content">
          <h2>👥 Community Study Library</h2>
          <p>Share knowledge, learn together, grow stronger!</p>
        </div>
      </div>

      {/* Controls */}
      <div className="library-controls card">
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {getTopicEmoji(topic)} {topic}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">🌱 Beginner</option>
              <option value="Intermediate">🌿 Intermediate</option>
              <option value="Advanced">🌳 Advanced</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="uploadDate">📅 Newest</option>
              <option value="likesCount">❤️ Most Liked</option>
              <option value="downloadsCount">📥 Most Downloaded</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn btn-primary upload-btn"
        >
          {showUploadForm ? '❌ Cancel' : '📤 Share Material'}
        </button>
      </div>     
 {/* Upload Form */}
      {showUploadForm && (
        <div className="upload-form card">
          <h3>📤 Share Your Study Material</h3>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>📝 Title *</label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                placeholder="Enter a descriptive title..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>📄 Description</label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                placeholder="Describe what this material covers..."
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>📁 File (PDF or TXT) *</label>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? '⏳ Uploading...' : '🚀 Share with Community'}
            </button>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message card">
          ❌ {error}
        </div>
      )}

      {/* Materials Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading community materials...</p>
          </div>
        </div>
      ) : (
        <div className="materials-grid">
          {materials.map((material) => (
            <div key={material._id} className="material-card card">
              <div className="material-header">
                <div className="topic-badge">
                  {getTopicEmoji(material.topic)} {material.topic}
                </div>
                <div 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(material.difficulty) }}
                >
                  {material.difficulty}
                </div>
              </div>

              <div className="material-content">
                <h3 className="material-title">{material.title}</h3>
                {material.description && (
                  <p className="material-description">{material.description}</p>
                )}
                
                <div className="material-meta">
                  <span className="uploader">👤 {material.uploaderName}</span>
                  <span className="upload-date">
                    📅 {new Date(material.uploadDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="material-tags">
                  {material.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="material-actions">
                <div className="stats">
                  <span className="stat">❤️ {material.likesCount}</span>
                  <span className="stat">📥 {material.downloadsCount}</span>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => handleLike(material._id)}
                    className={`btn btn-secondary like-btn ${material.isLiked ? 'liked' : ''}`}
                  >
                    {material.isLiked ? '💖' : '🤍'}
                  </button>
                  
                  <button
                    onClick={() => handleDownload(material._id, material.title)}
                    className="btn btn-primary download-btn"
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && materials.length === 0 && (
        <div className="empty-state card">
          <div className="empty-content">
            <span className="empty-icon">📚</span>
            <h3>No materials found</h3>
            <p>Be the first to share study materials with the community!</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="btn btn-primary"
            >
              📤 Share First Material
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityLibrary;