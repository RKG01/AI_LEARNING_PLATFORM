import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthInput from './AuthInput';
import SocialButtons from './SocialButtons';

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
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
  form: { display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' },
  link: { background: 'none', border: 'none', padding: 0, fontSize: '13px', color: '#818cf8', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit', textShadow: 'none' },
  alert: { display: 'flex', alignItems: 'center', gap: '9px', padding: '11px 14px', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: '10px', fontSize: '13px', color: '#fca5a5', lineHeight: 1.4, fontFamily: 'inherit', textShadow: 'none' },
  terms: { fontSize: '12.5px', color: '#475569', lineHeight: 1.55, margin: '-2px 0 0', fontFamily: 'inherit', textShadow: 'none' },
  btn: (loading) => ({
    width: '100%', padding: '13px 20px', border: 'none', borderRadius: '12px',
    background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
    color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1, marginTop: '4px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', fontFamily: 'inherit', textShadow: 'none',
    boxShadow: '0 4px 20px rgba(99,102,241,0.38)', transition: 'transform 0.2s, box-shadow 0.2s',
  }),
  switchLine: { marginTop: '20px', textAlign: 'center', fontSize: '13.5px', color: '#94a3b8', fontFamily: 'inherit', textShadow: 'none' },
  strengthWrap: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '-4px' },
  strengthBar: { display: 'flex', gap: '4px', flex: 1 },
  seg: (on, color) => ({
    height: '4px', flex: 1, borderRadius: '99px',
    background: on ? { weak: '#ef4444', fair: '#f59e0b', good: '#3b82f6', strong: '#10b981' }[color] : 'rgba(71,85,105,0.3)',
    transition: 'background 0.2s',
  }),
  strengthLabel: (color) => ({
    fontSize: '11.5px', fontWeight: 600, width: '44px', textAlign: 'right', flexShrink: 0,
    color: { weak: '#ef4444', fair: '#f59e0b', good: '#3b82f6', strong: '#10b981' }[color],
    fontFamily: 'inherit', textShadow: 'none',
  }),
};

function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: 'weak' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { score: 1, label: 'Weak', color: 'weak' },
    { score: 2, label: 'Fair', color: 'fair' },
    { score: 3, label: 'Good', color: 'good' },
    { score: 4, label: 'Strong', color: 'strong' },
  ];
  return levels[Math.min(score, 4) - 1] || { score: 0, label: 'Weak', color: 'weak' };
}

const Spinner = () => (
  <span style={{
    width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block',
    animation: 'authSpin 0.65s linear infinite', flexShrink: 0,
  }} aria-label="Loading…" />
);

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters long'); setLoading(false); return; }
    const result = await register(formData.name, formData.email, formData.password);
    if (!result.success) setError(result.error);
    setLoading(false);
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div style={S.root}>
      <div style={S.header}>
        <h2 style={S.title}>Create your account</h2>
        <p style={S.subtitle}>Start learning smarter in seconds</p>
      </div>

      <SocialButtons action="sign up" />

      <form onSubmit={handleSubmit} noValidate style={S.form}>
        <AuthInput id="reg-name" label="Full name" type="text" name="name"
          value={formData.name} onChange={handleChange} placeholder="Alex Johnson"
          required icon={<UserIcon />} autoComplete="name" />

        <AuthInput id="reg-email" label="Email address" type="email" name="email"
          value={formData.email} onChange={handleChange} placeholder="you@example.com"
          required icon={<MailIcon />} autoComplete="email" />

        <AuthInput id="reg-password" label="Password" type="password" name="password"
          value={formData.password} onChange={handleChange} placeholder="Min. 6 characters"
          required icon={<LockIcon />} autoComplete="new-password" hint="Use at least 6 characters" />

        {formData.password.length > 0 && (
          <div style={S.strengthWrap} aria-live="polite">
            <div style={S.strengthBar}>
              {[1, 2, 3, 4].map(i => (
                <span key={i} style={S.seg(i <= strength.score, strength.color)} />
              ))}
            </div>
            <span style={S.strengthLabel(strength.color)}>{strength.label}</span>
          </div>
        )}

        <AuthInput id="reg-confirm" label="Confirm password" type="password" name="confirmPassword"
          value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password"
          required icon={<LockIcon />} autoComplete="new-password" />

        {error && (
          <div style={S.alert} role="alert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ color: '#fca5a5', fontFamily: 'inherit', textShadow: 'none' }}>{error}</span>
          </div>
        )}

        <p style={S.terms}>
          By creating an account you agree to our{' '}
          <button type="button" style={S.link}>Terms of Service</button>
          {' '}and{' '}
          <button type="button" style={S.link}>Privacy Policy</button>.
        </p>

        <button type="submit" disabled={loading} style={S.btn(loading)}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.38)'; }}>
          {loading ? <Spinner /> : <span style={{ color: '#fff', fontFamily: 'inherit', textShadow: 'none' }}>Create account</span>}
        </button>
      </form>

      <p style={S.switchLine}>
        Already have an account?{' '}
        <button type="button" style={S.link} onClick={onSwitchToLogin}>Sign in</button>
      </p>
    </div>
  );
};

export default RegisterForm;
