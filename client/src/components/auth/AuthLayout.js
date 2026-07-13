import { useEffect, useRef } from 'react';
import '../../styles/auth.css';

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'AI-Powered Learning',
    desc: 'Generate summaries, flashcards, and quizzes from any document instantly.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Track Your Progress',
    desc: 'Visualize mastery across subjects with detailed analytics.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Community Library',
    desc: 'Share and discover study materials from thousands of learners.',
  },
];

const S = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: '#080b11',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
    overflow: 'hidden',
  },
  left: {
    flex: '1 1 0',
    minWidth: 0,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#0a0d14',
    borderRight: '1px solid rgba(99,102,241,0.12)',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  leftContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    padding: '56px 52px',
    gap: '36px',
    overflowY: 'auto',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  brandName: {
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '-0.4px',
    background: 'linear-gradient(90deg,#818cf8,#a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
    fontFamily: 'inherit',
  },
  heroTitle: {
    fontSize: 'clamp(24px,3vw,38px)',
    fontWeight: 800,
    letterSpacing: '-0.8px',
    lineHeight: 1.18,
    color: '#f1f5f9',
    margin: '0 0 14px',
    fontFamily: 'inherit',
    textShadow: 'none',
    background: 'none',
    WebkitTextFillColor: '#f1f5f9',
  },
  heroSub: {
    fontSize: '15px',
    lineHeight: 1.65,
    color: '#94a3b8',
    margin: 0,
    fontFamily: 'inherit',
    textShadow: 'none',
  },
  featureList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  featureIcon: {
    flexShrink: 0,
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.22)',
    borderRadius: '11px',
    color: '#818cf8',
  },
  featureTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f1f5f9',
    margin: '0 0 3px',
    display: 'block',
    fontFamily: 'inherit',
    textShadow: 'none',
  },
  featureDesc: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.55,
    display: 'block',
    fontFamily: 'inherit',
    textShadow: 'none',
  },
  testimonial: {
    background: 'rgba(99,102,241,0.07)',
    border: '1px solid rgba(99,102,241,0.16)',
    borderRadius: '14px',
    padding: '20px 22px',
    maxWidth: '440px',
  },
  testimonialText: {
    fontSize: '14px',
    fontStyle: 'italic',
    color: '#94a3b8',
    margin: '0 0 14px',
    lineHeight: 1.6,
    fontFamily: 'inherit',
    textShadow: 'none',
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
    fontFamily: 'inherit',
    textShadow: 'none',
  },
  authorName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f1f5f9',
    margin: 0,
    display: 'block',
    fontFamily: 'inherit',
    textShadow: 'none',
  },
  authorRole: {
    fontSize: '12px',
    color: '#475569',
    margin: 0,
    display: 'block',
    fontFamily: 'inherit',
    textShadow: 'none',
  },
  right: {
    width: '500px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
    background: '#080b11',
    position: 'relative',
    overflowY: 'auto',
  },
  card: {
    width: '100%',
    maxWidth: '410px',
    background: 'rgba(15,18,28,0.92)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '20px',
    padding: '40px 36px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    position: 'relative',
    zIndex: 1,
    fontFamily: 'inherit',
  },
};

const AuthLayout = ({ children, heading, subheading }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prevBg = document.body.style.background;
    const prevOf = document.body.style.overflow;
    document.body.style.background = '#080b11';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.background = prevBg;
      document.body.style.overflow = prevOf;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 90 + 40,
      dx: (Math.random() - 0.5) * 0.18,
      dy: (Math.random() - 0.5) * 0.18,
      color: Math.random() > 0.5 ? 'rgba(99,102,241,' : 'rgba(139,92,246,',
      alpha: Math.random() * 0.12 + 0.04,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < -p.r) p.x = W + p.r;
        if (p.x > W + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = H + p.r;
        if (p.y > H + p.r) p.y = -p.r;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div style={S.root}>
      {/* Left branding panel */}
      <div style={S.left}>
        <canvas ref={canvasRef} style={S.canvas} aria-hidden="true" />
        <div style={S.leftContent}>

          <div style={S.brand}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ filter: 'drop-shadow(0 0 14px rgba(99,102,241,0.45))' }}>
              <rect width="36" height="36" rx="10" fill="url(#g1)" />
              <path d="M10 26L18 10l8 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 21h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="36" y2="36">
                  <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span style={S.brandName}>StudyAI</span>
          </div>

          <div>
            <h1 style={S.heroTitle}>{heading}</h1>
            <p style={S.heroSub}>{subheading}</p>
          </div>

          <ul style={S.featureList}>
            {FEATURES.map(f => (
              <li key={f.title} style={S.feature}>
                <span style={S.featureIcon} aria-hidden="true">{f.icon}</span>
                <div>
                  <span style={S.featureTitle}>{f.title}</span>
                  <span style={S.featureDesc}>{f.desc}</span>
                </div>
              </li>
            ))}
          </ul>

          <div style={S.testimonial}>
            <p style={S.testimonialText}>
              "StudyAI cut my exam prep time in half. The AI flashcards are genuinely impressive."
            </p>
            <div style={S.testimonialAuthor}>
              <span style={S.avatar}>AK</span>
              <div>
                <span style={S.authorName}>Aisha Khan</span>
                <span style={S.authorRole}>Med student, Class of 2026</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right auth card */}
      <div style={S.right}>
        {/* Top accent line on card via CSS class — see auth.css */}
        <div className="al-card-wrap" style={S.card}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
