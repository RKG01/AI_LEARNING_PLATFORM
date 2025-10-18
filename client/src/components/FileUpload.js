import React, { useState } from 'react';
import axios from 'axios';
import { useProgress } from '../contexts/ProgressContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const { updateProgress } = useProgress();

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setMessage('');
      return;
    }

    // Check file type
    if (selectedFile.type !== 'application/pdf' && selectedFile.type !== 'text/plain') {
      setMessage('Please select a PDF or text file');
      setFile(null);
      return;
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      setMessage(`File too large. Maximum size allowed is 50MB. Your file is ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`✅ ${response.data.message}`);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
      // Update progress tracking
      try {
        await updateProgress('upload');
      } catch (error) {
        console.error('Error updating upload progress:', error);
      }
      
      // Trigger a custom event to refresh file list
      window.dispatchEvent(new CustomEvent('fileUploaded'));
      
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`❌ ${error.response?.data?.error || 'Upload failed'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h2>👩‍💻 Upload Learning Material</h2>
      
      <div 
        className={`file-upload ${dragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div>
          <p>📁 Drag and drop your PDF or text file here, or click to select</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            Supported: PDF, TXT files • Maximum size: 50MB
          </p>
          <input
            id="file-input"
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
        
        {file && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#e8f5e8', 
            borderRadius: '4px',
            border: '1px solid #4caf50'
          }}>
            <p><strong>✅ Selected:</strong> {file.name}</p>
            <p><strong>📏 Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>📄 Type:</strong> {file.type === 'application/pdf' ? 'PDF Document' : 'Text File'}</p>
          </div>
        )}
        
        <button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
      
      {message && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          borderRadius: '4px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;