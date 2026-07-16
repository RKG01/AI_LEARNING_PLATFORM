import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useProgress } from '../contexts/ProgressContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

const COLORS = { indigo: '#6366f1', violet: '#8b5cf6', emerald: '#10b981', sky: '#38bdf8', amber: '#f59e0b', rose: '#f43f5e' };

const StatCard = ({ icon, value, label, color, pct }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '1.25rem 1.5rem', marginBottom: 0 }}>
    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem' }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{value}</p>
      <p style={{ margin: '4px 0 8px', fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{label}</p>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99 }}>
        <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 99, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  </div>
);

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, boxWidth: 10, padding: 16 } },
    tooltip: { backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8', borderColor: 'rgba(99,102,241,0.3)', borderWidth: 1 },
  },
  scales: {
    y: { beginAtZero: true, ticks: { color: '#475569', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    x: { ticks: { color: '#475569', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

const doughnutOpts = {
  responsive: true, maintainAspectRatio: true, aspectRatio: 1,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8', borderColor: 'rgba(99,102,241,0.3)', borderWidth: 1 },
  },
  elements: { arc: { borderWidth: 2 } },
  cutout: '72%',
};

const ProgressAnalytics = () => {
  const { progress, loading, achievements, getProgressPercentages, getMotivationalMessage, getLevelInfo } = useProgress();

  if (loading) return <div className="card"><div className="loading"><div className="spinner" /><p>Loading your progress…</p></div></div>;
  if (!progress) return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
      <p style={{ color: '#94a3b8' }}>Start learning to see your progress!</p>
    </div>
  );

  const pct = getProgressPercentages();
  const msg = getMotivationalMessage();
  const lvl = getLevelInfo();

  const barData = {
    labels: ['Uploads', 'Summaries', 'Flashcards', 'Quizzes'],
    datasets: [{ label: 'Completed', data: [progress.uploads, progress.summaries, progress.flashcardsReviewed, progress.quizzesAttempted], backgroundColor: [COLORS.indigo + 'cc', COLORS.violet + 'cc', COLORS.emerald + 'cc', COLORS.sky + 'cc'], borderColor: [COLORS.indigo, COLORS.violet, COLORS.emerald, COLORS.sky], borderWidth: 2, borderRadius: 6 }],
  };

  const lineData = {
    labels: ['Uploads', 'Summaries', 'Flashcards', 'Quizzes'],
    datasets: [{ label: 'Daily Goal %', data: [pct.uploads, pct.summaries, pct.flashcards, pct.quizzes], borderColor: COLORS.indigo, backgroundColor: COLORS.indigo + '22', fill: true, tension: 0.4, pointBackgroundColor: COLORS.indigo, pointRadius: 5 }],
  };

  const donutData = {
    labels: ['Score', 'Remaining'],
    datasets: [{ data: [progress.avgScore, 100 - progress.avgScore], backgroundColor: [COLORS.emerald + 'cc', 'rgba(255,255,255,0.05)'], borderColor: [COLORS.emerald, 'rgba(255,255,255,0.08)'], borderWidth: 2 }],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Hero header */}
      <div className="card" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.06))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '2rem', alignItems: 'center' }}>
          {/* Level */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 16, padding: '14px 20px', marginBottom: 8 }}>
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Level</span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{lvl.level}</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{ height: '100%', width: `${(lvl.xp / lvl.nextLevelXP) * 100}%`, background: 'linear-gradient(90deg,#818cf8,#c4b5fd)', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#818cf8' }}>{lvl.xp}/{lvl.nextLevelXP} XP</span>
          </div>

          {/* Message */}
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Progress & Analytics</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>{msg}</p>
          </div>

          {/* Streak */}
          <div style={{ textAlign: 'center', padding: '12px 20px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14 }}>
            <span style={{ display: 'block', fontSize: '2rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>{progress.studyStreak}</span>
            <span style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 500 }}>Day Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
        <StatCard icon="📂" value={progress.uploads}           label="Files Uploaded"       color={COLORS.indigo}  pct={pct.uploads} />
        <StatCard icon="📝" value={progress.summaries}         label="Summaries Generated"  color={COLORS.violet}  pct={pct.summaries} />
        <StatCard icon="🃏" value={progress.flashcardsReviewed} label="Flashcards Reviewed" color={COLORS.emerald} pct={pct.flashcards} />
        <StatCard icon="✅" value={progress.quizzesAttempted}   label="Quizzes Completed"   color={COLORS.sky}     pct={pct.quizzes} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', textAlign: 'center' }}>Activity Overview</h3>
          <div style={{ height: 260 }}><Bar data={barData} options={chartOpts} /></div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', textAlign: 'center' }}>Daily Goal Progress</h3>
          <div style={{ height: 260 }}><Line data={lineData} options={chartOpts} /></div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', textAlign: 'center' }}>Avg Quiz Score</h3>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Doughnut data={donutData} options={doughnutOpts} />
            <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
              <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 800, color: COLORS.emerald, lineHeight: 1 }}>{progress.avgScore.toFixed(0)}%</span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Average</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="card">
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
            🏆 Achievements <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#475569', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 20 }}>{achievements.length}</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
            {achievements.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 1.25rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12 }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{a.name}</p>
                  <p style={{ margin: '2px 0', fontSize: '0.78rem', color: '#64748b' }}>{a.description}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#334155' }}>{new Date(a.unlockedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressAnalytics;
