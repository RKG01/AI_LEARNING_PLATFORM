import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FileList = ({ onFileSelect, selectedFileId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFiles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/files?page=${page}&limit=10`);
      if (response.data.files) {
        setFiles(response.data.files);
        setPagination(response.data.pagination);
      } else {
        setFiles(response.data);
        setPagination({});
      }
      setCurrentPage(page);
      setError('');
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    const handler = () => fetchFiles();
    window.addEventListener('fileUploaded', handler);
    return () => window.removeEventListener('fileUploaded', handler);
  }, []);

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return (
    <div className="card">
      <div className="loading"><div className="spinner" /><p>Loading files…</p></div>
    </div>
  );

  if (error) return (
    <div className="card">
      <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>
      <button onClick={() => fetchFiles()} className="btn btn-secondary">Retry</button>
    </div>
  );

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
          Your Files
          <span style={{ marginLeft: '8px', fontSize: '0.75rem', fontWeight: 500, color: '#475569', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '20px' }}>
            {pagination.totalFiles ?? files.length}
          </span>
        </h3>
        {selectedFileId && (
          <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            File selected
          </span>
        )}
      </div>

      {files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#475569' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.4 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <p style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#94a3b8' }}>No files uploaded yet</p>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>Upload a PDF or text file to get started</p>
        </div>
      ) : (
        <div className="file-list">
          {files.map((file) => {
            const selected = selectedFileId === file._id;
            return (
              <div key={file._id} className={`file-item${selected ? ' selected' : ''}`} onClick={() => onFileSelect(file._id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '8px', background: selected ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={selected ? '#818cf8' : '#475569'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.originalName}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569' }}>{fmt(file.uploadDate)}</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: selected ? '#818cf8' : '#334155', flexShrink: 0 }}>
                  {selected ? '✓ Selected' : 'Select'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
          <button onClick={() => fetchFiles(currentPage - 1)} disabled={!pagination.hasPrevPage} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>← Prev</button>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Page {pagination.currentPage} / {pagination.totalPages}</span>
          <button onClick={() => fetchFiles(currentPage + 1)} disabled={!pagination.hasNextPage} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default FileList;
