import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useProgress } from '../contexts/ProgressContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const S = {
  page: { maxWidth: 800, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' },
  iconBox: { width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  title: { margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' },
  sub: { margin: 0, fontSize: '0.8rem', color: '#64748b' },
  scene: { width: '100%', height: 320, perspective: 1200, marginBottom: '2rem' },
  inner: (flipped) => ({
    position: 'relative', width: '100%', height: '100%',
    transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
    transformStyle: 'preserve-3d',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
    cursor: 'pointer',
  }),
  face: (isBack) => ({
    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '2.5rem', borderRadius: 24, textAlign: 'center',
    border: '1px solid rgba(99,102,241,0.2)',
    transform: isBack ? 'rotateY(180deg)' : 'none',
    background: isBack
      ? 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(56,189,248,0.08))'
      : 'linear-gradient(135deg,rgba(99,102,241,0.14),rgba(139,92,246,0.08))',
    boxShadow: isBack
      ? '0 24px 64px rgba(0,0,0,0.45), 0 0 40px rgba(16,185,129,0.12)'
      : '0 24px 64px rgba(0,0,0,0.45), 0 0 40px rgba(99,102,241,0.12)',
    backdropFilter: 'blur(20px)',
  }),
  faceLabel: (isBack) => ({
    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: '1rem',
    color: isBack ? '#34d399' : '#818cf8',
    background: isBack ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)',
    padding: '4px 12px', borderRadius: 20,
    border: `1px solid ${isBack ? 'rgba(16,185,129,0.25)' : 'rgba(99,102,241,0.25)'}`,
  }),
  faceText: { fontSize: '1.1rem', fontWeight: 500, color: '#f1f5f9', lineHeight: 1.6, margin: 0 },
  faceHint: { fontSize: '0.75rem', color: '#475569', marginTop: '1.5rem' },
  controls: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' },
  counter: { fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 20px', borderRadius: 10 },
  progress: { width: '100%', height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden', marginBottom: '1.5rem' },
  progressFill: (pct) => ({ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width 0.4s ease' }),
  tip: { padding: '10px 16px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, textAlign: 'center', fontSize: '0.8rem', color: '#64748b' },
  emptyBox: { textAlign: 'center', padding: '3rem 1rem' },
};

const FlashcardView = ({ fileId }) => {
  const [flashcards, setFlashcards] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { updateProgress } = useProgress();

  const fetchFlashcards = useCallback(async () => {
    if (!fileId) return;
    try {
      setLoading(true); setError('');
      const response = await axios.get(`${API_BASE_URL}/flashcards/${fileId}`);
      setFlashcards(response.data); setCurrentCardIndex(0); setIsFlipped(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate flashcards');
    } finally { setLoading(false); }
  }, [fileId]);

  useEffect(() => {
    if (fileId) fetchFlashcards();
    else { setFlashcards(null); setError(''); }
  }, [fileId, fetchFlashcards]);

  const handleCardClick = async () => {
    setIsFlipped(v => !v);
    if (!isFlipped) {
      try { await updateProgress('flashcard', { count: 1 }); } catch (e) { console.error(e); }
    }
  };

  const goNext = () => { if (flashcards && currentCardIndex < flashcards.cards.length - 1) { setCurrentCardIndex(i => i + 1); setIsFlipped(false); } };
  const goPrev = () => { if (currentCardIndex > 0) { setCurrentCardIndex(i => i - 1); setIsFlipped(false); } };
  const reset  = () => { setCurrentCardIndex(0); setIsFlipped(false); };

  if (!fileId) return (
    <div className="card" style={S.emptyBox}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 4 }}>No file selected</p>
      <p style={{ color: '#475569', fontSize: '0.8rem' }}>Select a file from the Upload tab to generate flashcards</p>
    </div>
  );

  if (loading) return (
    <div className="card"><div className="loading"><div className="spinner" /><p>Generating flashcards with AI…</p></div></div>
  );

  if (error) return (
    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
      <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>
      <button onClick={fetchFlashcards} className="btn btn-secondary">Try Again</button>
    </div>
  );

  if (!flashcards?.cards?.length) return (
    <div className="card" style={S.emptyBox}><p style={{ color: '#64748b' }}>No flashcards available</p></div>
  );

  const card = flashcards.cards[currentCardIndex];
  const total = flashcards.cards.length;
  const pct = ((currentCardIndex + 1) / total) * 100;

  return (
    <div style={S.page}>
      <div className="card">
        <div style={S.header}>
          <div style={S.iconBox}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div>
            <h2 style={S.title}>Flashcards</h2>
            <p style={S.sub}>{total} cards · click card to flip</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={fetchFlashcards} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>↺ Regenerate</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={S.progress}><div style={S.progressFill(pct)} /></div>

        {/* 3-D card */}
        <div style={S.scene}>
          <div style={S.inner(isFlipped)} onClick={handleCardClick}>
            {/* Front */}
            <div style={S.face(false)}>
              <span style={S.faceLabel(false)}>Question</span>
              <p style={S.faceText}>{card.question}</p>
              <p style={S.faceHint}>Click to reveal answer</p>
            </div>
            {/* Back */}
            <div style={S.face(true)}>
              <span style={S.faceLabel(true)}>Answer</span>
              <p style={S.faceText}>{card.answer}</p>
              <p style={S.faceHint}>Click to see question</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={S.controls}>
          <button onClick={goPrev} disabled={currentCardIndex === 0} className="btn btn-secondary">← Prev</button>
          <span style={S.counter}>{currentCardIndex + 1} / {total}</span>
          <button onClick={goNext} disabled={currentCardIndex === total - 1} className="btn btn-secondary">Next →</button>
          <button onClick={reset} className="btn btn-secondary">↺ Reset</button>
        </div>

        <div style={S.tip}>💡 Try answering before you flip — recall is stronger than recognition</div>
      </div>
    </div>
  );
};

export default FlashcardView;
