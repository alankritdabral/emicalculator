'use client';

import Script from 'next/script';

export default function Page() {
  return (
    <>

  {/* Background Animated Blobs */}
  <div className="background-elements">
    <div className="blob blob-1" />
    <div className="blob blob-2" />
  </div>
  {/* Demo Banner (Auto-shown if Firebase keys are not yet configured) */}
  <div id="demo-banner" className="demo-mode-banner" style={{display: 'none'}}>
    <div className="banner-content">
      <span className="badge-pill">Demo Mode</span>
      <span>Firebase keys not configured yet. <strong>Demo Code:</strong> <code style={{background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4, color: '#FDE68A'}}>482731</code> | <strong>Admin:</strong> <code style={{background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4, color: '#FDE68A'}}>admin@creditexpertindia.com</code> / <code style={{background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4, color: '#FDE68A'}}>admin123</code></span>
    </div>
  </div>
  {/* Main Auth Card */}
  <div className="auth-wrapper">
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-badge">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          CREDIT EXPERT INDIA
        </div>
        <h1>Secure Portal Access</h1>
        <p>Enter today's 6-digit access code to enter the EMI Calculator, or sign in as administrator.</p>
      </div>
      {/* Segmented Switcher */}
      <div className="auth-tabs" role="tablist">
        <button type="button" className="auth-tab active" id="tab-user" onClick={() => { switchTab('user') }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x={3} y={11} width={18} height={11} rx={2} ry={2} /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Daily Access Code
        </button>
        <button type="button" className="auth-tab" id="tab-admin" onClick={() => { switchTab('admin') }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
          Admin Login
        </button>
      </div>
      {/* Alert Box */}
      <div id="auth-alert" className="auth-alert" style={{display: 'none'}} />
      {/* 1. USER ACCESS CODE VIEW */}
      <form id="user-code-form" onSubmit={(e) => { e.preventDefault(); window.handleUserSubmit(e) }}>
        <div className="pin-input-group">
          <label className="pin-label">ENTER 6-DIGIT CODE</label>
          <div className="pin-inputs" id="pin-container">
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} className="pin-digit" data-idx={0} autoFocus autoComplete="off" />
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} className="pin-digit" data-idx={1} autoComplete="off" />
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} className="pin-digit" data-idx={2} autoComplete="off" />
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} className="pin-digit" data-idx={3} autoComplete="off" />
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} className="pin-digit" data-idx={4} autoComplete="off" />
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} className="pin-digit" data-idx={5} autoComplete="off" />
          </div>
        </div>
        <button type="submit" className="auth-btn primary" id="btn-verify-user">
          <span>Unlock Calculator</span>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" /></svg>
        </button>
      </form>
      {/* 2. ADMIN LOGIN VIEW */}
      <form id="admin-login-form" style={{display: 'none'}} onSubmit={(e) => { e.preventDefault(); window.handleAdminSubmit(e) }}>
        <div className="input-group" style={{marginBottom: 16}}>
          <label htmlFor="admin-email" style={{display: 'block', fontSize: 13, fontWeight: 600, color: '#CBD5E1', marginBottom: 8}}>Admin Email</label>
          <div className="input-wrapper" style={{borderRadius: 12, border: '1.5px solid var(--card-border)', background: 'var(--input-bg)', padding: '4px 12px'}}>
            <input type="email" id="admin-email" placeholder="admin@creditexpertindia.com" required style={{width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: 15, padding: '10px 0'}} />
          </div>
        </div>
        <div className="input-group" style={{marginBottom: 24}}>
          <label htmlFor="admin-password" style={{display: 'block', fontSize: 13, fontWeight: 600, color: '#CBD5E1', marginBottom: 8}}>Password</label>
          <div className="input-wrapper" style={{borderRadius: 12, border: '1.5px solid var(--card-border)', background: 'var(--input-bg)', padding: '4px 12px'}}>
            <input type="password" id="admin-password" placeholder="••••••••" required style={{width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: 15, padding: '10px 0'}} />
          </div>
        </div>
        <button type="submit" className="auth-btn primary" id="btn-login-admin">
          <span>Sign In to Dashboard</span>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1={15} y1={12} x2={3} y2={12} /></svg>
        </button>
      </form>
      <div className="auth-footer">
        Daily code resets automatically at <strong>12:00 AM IST (Midnight)</strong> every day.<br />
        For access requests, please contact management.
      </div>
    </div>
  </div>
  {/* Firebase Compat SDKs */}
  {/* App Configuration & Authentication Gateway */}

      <Script src="/login.js" strategy="lazyOnload" />
    </>
  );
}