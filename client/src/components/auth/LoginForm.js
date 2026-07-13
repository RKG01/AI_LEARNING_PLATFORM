import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthInput from './AuthInput';
import SocialButtons from './SocialButtons';

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const S = {
  root: { display: 'flex', flexDirection: 'column', fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" },
  header: { marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px', color: '#f1f5f9', margin: '0 0 6px', fontFamily: 'inherit', textShadow: 'none', WebkitTextFillColor: '#f1f5f9', background: 'none' },
  subtitle: { fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: 1.5, fontFamily: 'inherit', textShadow: 'none' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '18px' },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  remember: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer', userSelect: 'none', fontFamily: 'inherit', textShadow: 'none' },
  checkbox: { width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6366f1', flexShrink: 0 },
  link: { background: 'none', border: 'none', padding: 0, fontSize: '13px', color: '#818cf8', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit', textShadow: 'none' },
  alert: { display: 'flex', alignItems: 'center', gap: '9px', padding: '11px 14px', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: '10px', fontSize: '13px', color: '#fca5a5', lineHeight: 1.4, fontFamily: 'inherit', textShadow: 'none' },
  btn: (loading) => ({
    width: '100%', padding: '13px 20px', border: 'none', borderRadius: '12px',
    background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
    color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1, marginTop: '4px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', fontFamily: 'inherit', textShadow: 'none',
    boxShadow: '0 4px 20px rgba(99,102,241,0.38)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }),
  switchLine: { marginTop: '20px', textAlign: 'center', fontSize: '13.5px', color: '#94a3b8', fontFamily: 'inherit', textShadow: 'none' },
  back: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', padding: '0 0 18px', fontFamily: 'inherit', textShadow: 'none' },
  success: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '28px 16px', textAlign: 'center' },
  successTxt: { fontSize: '14px', color: '#94a3b8', margin: 0, fontFamily: 'inherit', textShadow: 'none' },
};

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    const result = await login(formData.email, formData.password);
    if (!result.success) setError(result.error);
    setLoading(false);
  };

  if (showForgot) return <ForgotPassword onBack={() => setShowForgot(false)} />;

  return (
    <div style={S.root}>
      <div style={S.header}>
        <h2 style={S.title}>Welcome back</h2>
        <p style={S.subtitle}>Sign in to continue your learning journey</p>
      </div>

      <SocialButtons action="sign in" />

      <form onSubmit={handleSubmit} noValidate style={S.form}>
        <AuthInput id="login-email" label="Email address" type="email" name="email"
          value={formData.email} onChange={handleChange} placeholder="you@example.com"
          required icon={<MailIcon />} autoComplete="email" />

        <AuthInput id="login-password" label="Password" type="password" name="password"
          value={formData.password} onChange={handleChange} placeholder="Enter your password"
          required icon={<LockIcon />} autoComplete="current-password" />

        <div style={S.row}>
          <label style={S.remember}>
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={S.checkbox} />
            <span style={{ color: '#94a3b8', fontFamily: 'inherit', textShadow: 'none' }}>Remember me</span>
          </label>
          <button type="button" style={S.link} onClick={() => setShowForgot(true)}>Forgot password?</button>
        </div>

        {error && (
          <div style={S.alert} role="alert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ color: '#fca5a5', fontFamily: 'inherit', textShadow: 'none' }}>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} style={S.btn(loading)}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.38)'; }}>
          {loading ? <Spinner /> : <span style={{ color: '#fff', fontFamily: 'inherit', textShadow: 'none' }}>Sign in</span>}
        </button>
      </form>

      <p style={S.switchLine}>
        Don't have an account?{' '}
        <button type="button" style={S.link} onClick={onSwitchToRegister}>Create one</button>
      </p>
    </div>
  );
};

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setSent(true); setLoading(false);
  };

  const MailIcon2 = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  return (
    <div style={S.root}>
      <button type="button" style={S.back} onClick={onBack} aria-label="Back to sign in">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span style={{ color: '#94a3b8', fontFamily: 'inherit', textShadow: 'none' }}>Back</span>
      </button>
      <div style={S.header}>
        <h2 style={S.title}>Reset password</h2>
        <p style={S.subtitle}>Enter your email and we'll send you a reset link.</p>
      </div>
      {sent ? (
        <div style={S.success} role="status">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p style={S.successTxt}>Check your inbox — a reset link is on its way.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate style={S.form}>
          <AuthInput id="forgot-email" label="Email address" type="email" name="email"
            value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            required autoComplete="email" icon={<MailIcon2 />} />
          <button type="submit" disabled={loading} style={S.btn(loading)}>
            {loading ? <Spinner /> : <span style={{ color: '#fff', fontFamily: 'inherit', textShadow: 'none' }}>Send reset link</span>}
          </button>
        </form>
      )}
    </div>
  );
};

const Spinner = () => (
  <span style={{
    width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block',
    animation: 'authSpin 0.65s linear infinite', flexShrink: 0,
  }} aria-label="Loading…" />
);

export default LoginForm;
