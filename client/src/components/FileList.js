import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FileList = ({ onFileSelect, selectedFileId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/files`);
      setFiles(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    
    // Listen for file upload events
    const handleFileUploaded = () => {
      fetchFiles();
    };
    
    window.addEventListener('fileUploaded', handleFileUploaded);
    
    return () => {
      window.removeEventListener('fileUploaded', handleFileUploaded);
    };
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3>Your Files</h3>
        <div style={{ color: 'red', textAlign: 'center' }}>
          {error}
          <br />
          <button onClick={fetchFiles} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>👩‍📚 Your Files ({files.length})</h3>
      
      {files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>📄 No files uploaded yet</p>
          <p>Upload your first PDF or text file to get started!</p>
        </div>
      ) : (
        <div className="file-list">
          {files.map((file) => (
            <div
              key={file._id}
              className={`file-item ${selectedFileId === file._id ? 'selected' : ''}`}
              onClick={() => onFileSelect(file._id)}
            >
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  📄 {file.originalName}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Uploaded: {formatDate(file.uploadDate)}
                </div>
              </div>
              
              <div style={{ fontSize: '0.9rem', color: '#007bff' }}>
                {selectedFileId === file._id ? '✓ Selected' : 'Click to select'}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedFileId && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <p>✅ File selected! You can now view summaries, flashcards, and quizzes.</p>
        </div>
      )}
    </div>
  );
};

export default FileList;