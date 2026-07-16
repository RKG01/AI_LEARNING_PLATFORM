import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useProgress } from '../contexts/ProgressContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const S = {
  page: { maxWidth: 960, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' },
  iconBox: { width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  title: { margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' },
  sub: { margin: 0, fontSize: '0.8rem', color: '#64748b' },
  voiceBar: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, marginBottom: '1.5rem', flexWrap: 'wrap' },
  voiceLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.06em', textTransform: 'uppercase' },
  voiceSelect: { padding: '6px 10px', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#f1f5f9', fontSize: '0.8rem', fontFamily: 'inherit', maxWidth: 200 },
  sliderGroup: { display: 'flex', flexDirection: 'column', gap: 3, minWidth: 120 },
  sliderLabel: { fontSize: '0.7rem', color: '#64748b', fontWeight: 500 },
  wave: (active) => ({ display: 'flex', alignItems: 'center', gap: 3, height: 24 }),
  overview: { marginBottom: '1.5rem' },
  overviewTitle: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6366f1', marginBottom: '10px' },
  overviewText: { fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.8 },
  topicsTitle: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6366f1', marginBottom: '12px' },
  topicCard: { marginBottom: '1rem', padding: '1.25rem 1.5rem', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid #6366f1', borderRadius: '0 12px 12px 0' },
  topicName: { fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' },
  topicBody: { fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.7 },
  tip: { padding: '10px 16px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 10, textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '1.5rem' },
};

const WaveBar = ({ active }) => (
  <div style={S.wave(active)}>
    {[1, 2, 3, 4].map(i => (
      <span key={i} style={{
        width: 3, borderRadius: 99, background: '#6366f1',
        height: active ? 'auto' : 8,
        animation: active ? `wave${i} 0.9s ${(i - 1) * 0.1}s ease-in-out infinite` : 'none',
        minHeight: 4, maxHeight: 20,
      }} />
    ))}
    <style>{`
      @keyframes wave1{0%,100%{height:6px}50%{height:20px}}
      @keyframes wave2{0%,100%{height:10px}50%{height:16px}}
      @keyframes wave3{0%,100%{height:14px}50%{height:8px}}
      @keyframes wave4{0%,100%{height:8px}50%{height:18px}}
    `}</style>
  </div>
);

const SummaryView = ({ fileId }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const utteranceRef = useRef(null);
  const { updateProgress } = useProgress();

  const stopSpeech = useCallback(() => { speechSynthesis.cancel(); setIsPlaying(false); setIsPaused(false); }, []);

  const fetchSummary = useCallback(async () => {
    if (!fileId) return;
    try {
      setLoading(true); setError('');
      const res = await axios.get(`${API_BASE_URL}/summary/${fileId}`);
      setSummary(res.data);
      try { await updateProgress('summary'); } catch (e) { console.error(e); }
    } catch (err) { setError(err.response?.data?.error || 'Failed to generate summary'); }
    finally { setLoading(false); }
  }, [fileId, updateProgress]);

  useEffect(() => {
    const load = () => {
      const v = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      setVoices(v);
      setSelectedVoice(v.find(v => /female|zira|samantha/i.test(v.name)) || v[0]);
    };
    load(); speechSynthesis.onvoiceschanged = load;
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    if (fileId) fetchSummary();
    else { setSummary(null); setError(''); stopSpeech(); }
  }, [fileId, fetchSummary, stopSpeech]);

  const playSummary = () => {
    if (!summary || !selectedVoice) return;
    speechSynthesis.cancel();
    let text = summary.content || '';
    if (summary.topics?.length) text += '. Key topics: ' + summary.topics.map(t => `${t.title}. ${t.content}`).join('. ');
    const utt = new SpeechSynthesisUtterance(text);
    utt.voice = selectedVoice; utt.rate = speechRate; utt.pitch = speechPitch; utt.volume = 1;
    utt.onstart = () => { setIsPlaying(true); setIsPaused(false); };
    utt.onend = () => { setIsPlaying(false); setIsPaused(false); };
    utt.onerror = () => { setIsPlaying(false); setIsPaused(false); };
    utteranceRef.current = utt;
    speechSynthesis.speak(utt);
  };

  const pauseSpeech = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) { speechSynthesis.pause(); setIsPaused(true); }
    else if (speechSynthesis.paused) { speechSynthesis.resume(); setIsPaused(false); }
  };

  if (!fileId) return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Select a file from Upload to generate a summary</p>
    </div>
  );
  if (loading) return <div className="card"><div className="loading"><div className="spinner" /><p>Generating summary with AI…</p></div></div>;
  if (error) return (
    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
      <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>
      <button onClick={fetchSummary} className="btn btn-secondary">Try Again</button>
    </div>
  );
  if (!summary) return <div className="card" style={{ textAlign: 'center', padding: '2rem' }}><p style={{ color: '#64748b' }}>No summary available</p></div>;

  return (
    <div style={S.page}>
      <div className="card">
        {/* Header */}
        <div style={S.header}>
          <div style={S.iconBox}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={S.title}>Summary</h2>
            <p style={S.sub}>{summary.topics?.length ?? 0} topics extracted</p>
          </div>
          <button onClick={fetchSummary} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>↺ Regenerate</button>
        </div>

        {/* Voice bar */}
        <div style={S.voiceBar}>
          <span style={S.voiceLabel}>🔊 Voice</span>
          <WaveBar active={isPlaying} />
          <select value={selectedVoice?.name || ''} onChange={e => setSelectedVoice(voices.find(v => v.name === e.target.value))} style={S.voiceSelect}>
            {voices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
          <div style={S.sliderGroup}>
            <span style={S.sliderLabel}>Speed {speechRate.toFixed(1)}×</span>
            <input type="range" min="0.5" max="2" step="0.1" value={speechRate} onChange={e => setSpeechRate(+e.target.value)} style={{ accentColor: '#6366f1', width: '100%' }} />
          </div>
          <div style={S.sliderGroup}>
            <span style={S.sliderLabel}>Pitch {speechPitch.toFixed(1)}</span>
            <input type="range" min="0.5" max="2" step="0.1" value={speechPitch} onChange={e => setSpeechPitch(+e.target.value)} style={{ accentColor: '#6366f1', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexWrap: 'wrap' }}>
            <button onClick={playSummary} disabled={isPlaying} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>{isPlaying ? '◉ Playing…' : '▶ Play'}</button>
            <button onClick={pauseSpeech} disabled={!isPlaying} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>{isPaused ? '▶ Resume' : '⏸ Pause'}</button>
            <button onClick={stopSpeech} disabled={!isPlaying && !isPaused} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>⏹ Stop</button>
          </div>
        </div>

        {/* Overview */}
        {summary.content && (
          <div style={S.overview}>
            <p style={S.overviewTitle}>Overview</p>
            <p style={S.overviewText}>{summary.content}</p>
          </div>
        )}

        {/* Topics */}
        {summary.topics?.length > 0 && (
          <div>
            <p style={S.topicsTitle}>Key Topics</p>
            {summary.topics.map((topic, i) => (
              <div key={i} style={S.topicCard}>
                <p style={S.topicName}>{topic.title}</p>
                <p style={S.topicBody}>{topic.content}</p>
              </div>
            ))}
          </div>
        )}

        <div style={S.tip}>💡 Play the summary aloud while reviewing flashcards for better retention</div>
      </div>
    </div>
  );
};

export default SummaryView;
