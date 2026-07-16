import React, { useState } from 'react';
import axios from 'axios';
import { useProgress } from '../contexts/ProgressContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const { updateProgress } = useProgress();

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) { setFile(null); setMessage(''); return; }
    if (selectedFile.type !== 'application/pdf' && selectedFile.type !== 'text/plain') {
      setMessage('Please select a PDF or text file');
      setFile(null); return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      setMessage(`File too large. Max 50MB. Your file is ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
      setFile(null); return;
    }
    setFile(selectedFile); setMessage('');
  };

  const handleFileChange = (e) => handleFileSelect(e.target.files[0]);
  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const handleDrop      = (e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); };

  const handleUpload = async () => {
    if (!file) { setMessage('Please select a file first'); return; }
    setUploading(true); setMessage('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage(`success:${response.data.message}`);
      setFile(null);
      const fi = document.getElementById('file-input');
      if (fi) fi.value = '';
      try { await updateProgress('upload'); } catch (e) { console.error(e); }
      window.dispatchEvent(new CustomEvent('fileUploaded'));
    } catch (error) {
      setMessage(`error:${error.response?.data?.error || 'Upload failed'}`);
    } finally {
      setUploading(false);
    }
  };

  const isSuccess = message.startsWith('success:');
  const msgText   = message.replace(/^(success|error):/, '');

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UploadIcon />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Upload Material</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>PDF or TXT · max 50 MB</p>
        </div>
      </div>

      <div
        className={`file-upload${dragOver ? ' dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ cursor: 'pointer' }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div style={{ color: '#475569', marginBottom: '1rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '4px' }}>
          {dragOver ? 'Drop it here' : 'Drag & drop your file here'}
        </p>
        <p style={{ color: '#475569', fontSize: '0.8rem' }}>or click to browse</p>
        <input id="file-input" type="file" accept=".pdf,.txt" onChange={handleFileChange}
          className="file-input" style={{ display: 'none' }} onClick={e => e.stopPropagation()} />
      </div>

      {file && (
        <div style={{ marginTop: '1rem', padding: '12px 16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type === 'application/pdf' ? 'PDF' : 'Text'}</p>
          </div>
        </div>
      )}

      <button onClick={handleUpload} disabled={!file || uploading} className="btn btn-primary"
        style={{ marginTop: '1rem', width: '100%', padding: '11px', fontSize: '0.9rem' }}>
        {uploading ? (
          <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Uploading…</>
        ) : 'Upload File'}
      </button>

      {message && (
        <div style={{ marginTop: '1rem', padding: '10px 14px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 500,
          background: isSuccess ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
          border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
          color: isSuccess ? '#34d399' : '#fb7185' }}>
          {isSuccess ? '✓ ' : '✕ '}{msgText}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
