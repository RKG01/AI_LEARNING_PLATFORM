import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DIFFICULTY_COLORS = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#f43f5e' };
const TOPIC_EMOJIS = { Mathematics:'🔢', 'Computer Science':'💻', Physics:'⚛️', Chemistry:'🧪', Biology:'🧬', History:'📚', Literature:'📖', Art:'🎨', Music:'🎵', Language:'🗣️', Business:'💼', Economics:'📈', Psychology:'🧠', Philosophy:'🤔', Engineering:'⚙️' };
const emo = t => TOPIC_EMOJIS[t] || '📝';

const S = {
  input: { padding: '9px 14px', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit', width: '100%' },
  select: { padding: '9px 12px', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f1f5f9', fontSize: '0.8rem', fontFamily: 'inherit' },
  matCard: { padding: '1.5rem', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, transition: 'all 0.25s ease', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12 },
  badge: (color) => ({ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, background: `${color}18`, color, border: `1px solid ${color}40` }),
  tag: { padding: '2px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, fontSize: '0.7rem', color: '#475569' },
  formInput: { width: '100%', padding: '10px 14px', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical' },
};

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
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', file: null });

  useAuth();

  const fetchMaterials = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '12', sortBy, sortOrder: 'desc' });
      if (searchTerm) params.append('search', searchTerm);
      if (selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      const res = await axios.get(`${API_BASE_URL}/materials?${params}`);
      setMaterials(res.data.materials);
      setTopics(res.data.topics);
      setError('');
    } catch { setError('Failed to load study materials'); }
    finally { setLoading(false); }
  }, [searchTerm, selectedTopic, selectedDifficulty, sortBy]);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title) { setError('Please provide both title and file'); return; }
    setUploading(true); setError('');
    const fd = new FormData();
    fd.append('file', uploadForm.file);
    fd.append('title', uploadForm.title);
    fd.append('description', uploadForm.description);
    try {
      await axios.post(`${API_BASE_URL}/materials/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadForm({ title: '', description: '', file: null });
      setShowUploadForm(false);
      fetchMaterials();
    } catch (err) { setError(err.response?.data?.error || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/materials/${id}/like`);
      setMaterials(prev => prev.map(m => m._id === id ? { ...m, likesCount: res.data.likesCount, isLiked: res.data.isLiked } : m));
    } catch { console.error('Like failed'); }
  };

  const handleDownload = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/materials/${id}/download`);
      const blob = new Blob([res.data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = res.data.filename;
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url); document.body.removeChild(a);
      setMaterials(prev => prev.map(m => m._id === id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m));
    } catch { setError('Download failed'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.06))', borderColor: 'rgba(99,102,241,0.2)', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>Community Library</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#64748b' }}>Share knowledge, learn together</p>
          </div>
          <button onClick={() => setShowUploadForm(v => !v)} className={`btn ${showUploadForm ? 'btn-secondary' : 'btn-primary'}`} style={{ fontSize: '0.875rem' }}>
            {showUploadForm ? '✕ Cancel' : '↑ Share Material'}
          </button>
        </div>
      </div>

      {/* Upload form */}
      {showUploadForm && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>Share Study Material</h3>
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Title *</label>
              <input type="text" value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))} placeholder="Enter a descriptive title…" style={S.formInput} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</label>
              <textarea value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this material cover?" style={{ ...S.formInput, minHeight: 80 }} rows="3" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>File (PDF or TXT) *</label>
              <input type="file" accept=".pdf,.txt" onChange={e => setUploadForm(f => ({ ...f, file: e.target.files[0] }))} style={{ ...S.formInput, cursor: 'pointer' }} required />
            </div>
            <button type="submit" disabled={uploading} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              {uploading ? 'Uploading…' : '↑ Share with Community'}
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="Search materials…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...S.input, maxWidth: 260 }} />
          <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} style={S.select}>
            <option value="all">All Topics</option>
            {topics.map(t => <option key={t} value={t}>{emo(t)} {t}</option>)}
          </select>
          <select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)} style={S.select}>
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={S.select}>
            <option value="uploadDate">Newest</option>
            <option value="likesCount">Most Liked</option>
            <option value="downloadsCount">Most Downloaded</option>
          </select>
          {(searchTerm || selectedTopic !== 'all' || selectedDifficulty !== 'all') && (
            <button onClick={() => { setSearchTerm(''); setSelectedTopic('all'); setSelectedDifficulty('all'); }} className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 10, color: '#fb7185', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="card"><div className="loading"><div className="spinner" /><p>Loading community materials…</p></div></div>
      ) : materials.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.4 }}>📚</span>
          <p style={{ color: '#94a3b8', marginBottom: 4 }}>No materials found</p>
          <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Be the first to share study materials!</p>
          <button onClick={() => setShowUploadForm(true)} className="btn btn-primary">Share First Material</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: '1.25rem' }}>
          {materials.map(m => (
            <div key={m._id} style={S.matCard}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = ''; }}>
              {/* Accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: '18px 18px 0 0' }} />

              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={S.badge('#818cf8')}>{emo(m.topic)} {m.topic}</span>
                <span style={S.badge(DIFFICULTY_COLORS[m.difficulty] || '#64748b')}>{m.difficulty}</span>
              </div>

              {/* Title + desc */}
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.4 }}>{m.title}</h3>
                {m.description && <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.description}</p>}
              </div>

              {/* Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#334155' }}>
                <span>👤 {m.uploaderName}</span>
                <span>{new Date(m.uploadDate).toLocaleDateString()}</span>
              </div>

              {/* Tags */}
              {m.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {m.tags.slice(0, 3).map((t, i) => <span key={i} style={S.tag}>#{t}</span>)}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: 14, fontSize: '0.8rem', color: '#475569' }}>
                  <span>♡ {m.likesCount}</span>
                  <span>↓ {m.downloadsCount}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleLike(m._id)} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '1rem', background: m.isLiked ? 'rgba(244,63,94,0.15)' : undefined, borderColor: m.isLiked ? 'rgba(244,63,94,0.35)' : undefined }}>
                    {m.isLiked ? '❤️' : '🤍'}
                  </button>
                  <button onClick={() => handleDownload(m._id)} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>↓ Download</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityLibrary;
