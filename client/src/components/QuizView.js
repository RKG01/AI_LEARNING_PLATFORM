import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useProgress } from '../contexts/ProgressContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const S = {
  page: { maxWidth: 860, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' },
  iconBox: { width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  title: { margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' },
  sub: { margin: 0, fontSize: '0.8rem', color: '#64748b' },
  toolbar: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 },
  select: { padding: '8px 12px', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit' },
  label: { fontSize: '0.8rem', color: '#64748b', fontWeight: 500 },
  qCard: { marginBottom: '1rem', padding: '1.5rem', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 },
  qNum: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6366f1', marginBottom: '8px' },
  qText: { fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '1rem', lineHeight: 1.55 },
  optList: { display: 'flex', flexDirection: 'column', gap: 7 },
  opt: (selected) => ({
    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px',
    background: selected ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${selected ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
    borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s ease',
    boxShadow: selected ? '0 0 0 1px rgba(99,102,241,0.2)' : 'none',
  }),
  optDot: (selected) => ({
    width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: '2px solid',
    borderColor: selected ? '#6366f1' : '#334155',
    background: selected ? '#6366f1' : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }),
  optText: (selected) => ({ fontSize: '0.875rem', color: selected ? '#c7d2fe' : '#94a3b8', fontWeight: selected ? 500 : 400 }),
  submitRow: { display: 'flex', justifyContent: 'center', marginTop: '1.5rem' },
  /* Results */
  resultBox: { textAlign: 'center', padding: '2.5rem', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, marginBottom: '1.5rem' },
  scoreNum: (color) => ({ fontSize: '4rem', fontWeight: 800, color, lineHeight: 1, marginBottom: '4px' }),
  scorePct: { fontSize: '1rem', color: '#94a3b8', marginBottom: '1.5rem' },
  reviewCard: (ok) => ({ marginBottom: '1rem', padding: '1.25rem 1.5rem', border: `1px solid ${ok ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, background: ok ? 'rgba(16,185,129,0.06)' : 'rgba(244,63,94,0.06)', borderRadius: 12 }),
  reviewQ: { fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' },
  reviewA: (ok) => ({ fontSize: '0.8rem', color: ok ? '#34d399' : '#fb7185', marginBottom: '4px' }),
  tip: { padding: '10px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, textAlign: 'center', fontSize: '0.8rem', color: '#78716c', marginTop: '1.5rem' },
};

const QuizView = ({ fileId }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [numQuestions, setNumQuestions] = useState(20);
  const { updateProgress } = useProgress();

  const fetchQuiz = useCallback(async (count = numQuestions) => {
    if (!fileId) return;
    try {
      setLoading(true); setError('');
      const res = await axios.get(`${API_BASE_URL}/quiz/${fileId}?questions=${count}`);
      setQuiz(res.data); setAnswers({}); setShowResults(false); setScore(0);
    } catch (err) { setError(err.response?.data?.error || 'Failed to generate quiz'); }
    finally { setLoading(false); }
  }, [fileId, numQuestions]);

  useEffect(() => {
    if (fileId) fetchQuiz();
    else { setQuiz(null); setError(''); }
  }, [fileId, fetchQuiz]);

  const submitQuiz = async () => {
    if (!quiz?.questions) return;
    let correct = 0;
    quiz.questions.forEach((q, i) => { if (answers[i] === q.correctAnswer) correct++; });
    const pct = (correct / quiz.questions.length) * 100;
    setScore(correct); setShowResults(true);
    try { await updateProgress('quiz', { score: pct }); } catch (e) { console.error(e); }
  };

  const scoreColor = () => {
    const pct = (score / (quiz?.questions?.length || 1)) * 100;
    return pct >= 80 ? '#34d399' : pct >= 60 ? '#fbbf24' : '#f87171';
  };

  const allAnswered = quiz?.questions?.every((_, i) => answers.hasOwnProperty(i));

  if (!fileId) return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Select a file from Upload to take a quiz</p>
    </div>
  );
  if (loading) return <div className="card"><div className="loading"><div className="spinner" /><p>Generating quiz with AI…</p></div></div>;
  if (error) return (
    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
      <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>
      <button onClick={() => fetchQuiz()} className="btn btn-secondary">Try Again</button>
    </div>
  );
  if (!quiz?.questions?.length) return <div className="card" style={{ textAlign: 'center', padding: '2rem' }}><p style={{ color: '#64748b' }}>No questions available</p></div>;

  return (
    <div style={S.page}>
      <div className="card">
        {/* Header */}
        <div style={S.header}>
          <div style={S.iconBox}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h2 style={S.title}>Quiz</h2>
            <p style={S.sub}>{quiz.questions.length} questions</p>
          </div>
        </div>

        {/* Toolbar */}
        {!showResults && (
          <div style={S.toolbar}>
            <span style={S.label}>Questions:</span>
            <select value={numQuestions} onChange={e => setNumQuestions(+e.target.value)} style={S.select}>
              {[10,15,20,25].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <button onClick={() => fetchQuiz(numQuestions)} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>↺ New Quiz</button>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#475569' }}>
              {Object.keys(answers).length}/{quiz.questions.length} answered
            </span>
          </div>
        )}

        {/* Questions */}
        {!showResults ? (
          <>
            {quiz.questions.map((q, qi) => (
              <div key={qi} style={S.qCard}>
                <p style={S.qNum}>Question {qi + 1}</p>
                <p style={S.qText}>{q.question}</p>
                <div style={S.optList}>
                  {q.options.map((opt, oi) => {
                    const sel = answers[qi] === oi;
                    return (
                      <div key={oi} style={S.opt(sel)} onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}>
                        <div style={S.optDot(sel)}>
                          {sel && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={S.optText(sel)}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={S.submitRow}>
              <button onClick={submitQuiz} disabled={!allAnswered} className="btn btn-success" style={{ padding: '12px 32px', fontSize: '0.95rem' }}>
                {allAnswered ? 'Submit Quiz' : `${quiz.questions.length - Object.keys(answers).length} questions left`}
              </button>
            </div>

            <div style={S.tip}>💡 Review summaries and flashcards before taking the quiz for best results</div>
          </>
        ) : (
          <>
            {/* Score */}
            <div style={S.resultBox}>
              <div style={S.scoreNum(scoreColor())}>{score}/{quiz.questions.length}</div>
              <p style={S.scorePct}>{((score / quiz.questions.length) * 100).toFixed(0)}% correct</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => { setAnswers({}); setShowResults(false); setScore(0); }} className="btn btn-secondary">↺ Retry</button>
                <button onClick={() => fetchQuiz(numQuestions)} className="btn btn-primary">↺ New Quiz</button>
              </div>
            </div>

            {/* Review */}
            <h3 style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Review</h3>
            {quiz.questions.map((q, qi) => {
              const ok = answers[qi] === q.correctAnswer;
              return (
                <div key={qi} style={S.reviewCard(ok)}>
                  <p style={S.reviewQ}>{qi + 1}. {q.question}</p>
                  <p style={S.reviewA(ok)}>Your answer: {q.options[answers[qi]]} {ok ? '✓' : '✗'}</p>
                  {!ok && <p style={{ fontSize: '0.8rem', color: '#34d399', margin: 0 }}>Correct: {q.options[q.correctAnswer]}</p>}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizView;
