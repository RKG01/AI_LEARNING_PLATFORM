import { useState } from 'react';

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const BASE = {
  group: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 500, color: '#94a3b8', letterSpacing: '0.01em', fontFamily: 'inherit', textShadow: 'none' },
  required: { color: '#f87171' },
  wrap: (focused, hasError) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    border: `1.5px solid ${hasError ? 'rgba(239,68,68,0.6)' : focused ? '#6366f1' : 'rgba(71,85,105,0.5)'}`,
    borderRadius: '12px',
    background: focused ? 'rgba(99,102,241,0.04)' : 'rgba(15,20,35,0.75)',
    boxShadow: focused ? (hasError ? '0 0 0 3px rgba(239,68,68,0.18)' : '0 0 0 3px rgba(99,102,241,0.22)') : 'none',
    transition: 'border-color 0.22s, box-shadow 0.22s, background 0.22s',
  }),
  leadIcon: (focused) => ({
    position: 'absolute',
    left: '14px',
    display: 'flex',
    alignItems: 'center',
    color: focused ? '#818cf8' : '#475569',
    pointerEvents: 'none',
    transition: 'color 0.22s',
  }),
  input: {
    width: '100%',
    padding: '13px 14px 13px 42px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '14.5px',
    color: '#f1f5f9',
    fontFamily: 'inherit',
    borderRadius: '12px',
    boxShadow: 'none',
    textShadow: 'none',
    WebkitTextFillColor: '#f1f5f9',
  },
  inputNoIcon: {
    width: '100%',
    padding: '13px 14px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '14.5px',
    color: '#f1f5f9',
    fontFamily: 'inherit',
    borderRadius: '12px',
    boxShadow: 'none',
    textShadow: 'none',
    WebkitTextFillColor: '#f1f5f9',
  },
  inputPwdRight: { paddingRight: '44px' },
  toggle: {
    position: 'absolute',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    color: '#475569',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
  },
  error: { fontSize: '12px', color: '#f87171', margin: 0, fontFamily: 'inherit', textShadow: 'none' },
  hint: { fontSize: '12px', color: '#475569', margin: 0, fontFamily: 'inherit', textShadow: 'none' },
};

const AuthInput = ({ id, label, type = 'text', name, value, onChange, placeholder, required, icon, autoComplete, error, hint, disabled }) => {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPwd ? 'text' : 'password') : type;

  const inputStyle = {
    ...(icon ? BASE.input : BASE.inputNoIcon),
    ...(isPassword ? BASE.inputPwdRight : {}),
  };

  return (
    <div style={BASE.group}>
      {label && (
        <label htmlFor={id} style={BASE.label}>
          {label}
          {required && <span style={BASE.required} aria-hidden="true"> *</span>}
        </label>
      )}
      <div style={BASE.wrap(focused, !!error)}>
        {icon && (
          <span style={BASE.leadIcon(focused)} aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          style={inputStyle}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            style={BASE.toggle}
            onClick={() => setShowPwd(v => !v)}
            aria-label={showPwd ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            <EyeIcon open={showPwd} />
          </button>
        )}
      </div>
      {error && <p id={`${id}-error`} style={BASE.error} role="alert">{error}</p>}
      {hint && !error && <p id={`${id}-hint`} style={BASE.hint}>{hint}</p>}
    </div>
  );
};

export default AuthInput;
