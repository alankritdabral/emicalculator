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
      <span>Running with simulated backend. Changes persist in local storage. Connect Firebase credentials in <code>firebase-config.js</code> to activate live Cloud Functions.</span>
    </div>
  </div>
  <div className="admin-layout">
    {/* Top Navigation Bar */}
    <nav className="admin-navbar">
      <div className="admin-brand">
        <div style={{background: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(191, 219, 254, 0.3)', padding: 8, borderRadius: 12, display: 'flex'}}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <div>
          <h2>CREDIT EXPERT INDIA</h2>
          <span style={{fontSize: 12, color: '#94A3B8', fontWeight: 500}}>Access Control Administration</span>
        </div>
      </div>
      <div className="admin-user-info">
        <a href="/" style={{color: '#93C5FD', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(191, 219, 254, 0.2)'}}>
          <span>Calculator</span>
        </a>
        <a href="/eligibility" style={{color: '#93C5FD', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(191, 219, 254, 0.2)'}}>
          <span>Eligibility</span>
        </a>
        <span className="admin-email-tag" id="display-admin-email">admin@creditexpertindia.com</span>
        <button type="button" className="session-logout-btn" onClick={() => { window.AuthSystem.logout() }}>Logout</button>
      </div>
    </nav>
    {/* Toast / Status Alert */}
    <div id="admin-alert" className="auth-alert" style={{display: 'none', marginBottom: 24}} />
    {/* Dashboard Grid */}
    <div className="admin-grid">
      {/* 1. Active Code Display Card */}
      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x={3} y={11} width={18} height={11} rx={2} ry={2} /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Current User Access Code
          </div>
          <button type="button" onClick={() => { copyCurrentCode() }} id="btn-copy-code" style={{background: 'rgba(11, 31, 58, 0.8)', border: '1px solid rgba(191, 219, 254, 0.2)', color: '#93C5FD', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6}}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x={9} y={9} width={13} height={13} rx={2} ry={2} /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            <span id="copy-label">Copy Code</span>
          </button>
        </div>
        <div className="active-code-display">
          <div className="code-number" id="active-code-display">------</div>
          <div className="code-meta-chips">
            <span className="meta-chip status-active">● ACTIVE</span>
            <span className="meta-chip type-random" id="active-code-type">RANDOM</span>
          </div>
        </div>
        {/* Expiry Countdown */}
        <div className="expiry-box">
          <div className="expiry-title">Time Remaining Until Next 12:00 AM IST Reset (Midnight)</div>
          <div className="countdown-timer" id="countdown-timer">--:--:--</div>
          <div className="expiry-footnote">The code automatically expires every night at 12:00 AM IST (Midnight).</div>
        </div>
      </div>
      {/* 2. Management Controls Card */}
      <div className="admin-panel-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <div>
          <div className="admin-card-header">
            <div className="admin-card-title">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
              Code Management
            </div>
          </div>
          {/* Quick Random Generation */}
          <div style={{background: 'rgba(11, 31, 58, 0.6)', border: '1px solid rgba(191, 219, 254, 0.12)', borderRadius: 14, padding: 18, marginBottom: 20}}>
            <h4 style={{fontSize: 14, color: '#FFFFFF', marginBottom: 6}}>Generate Random Code</h4>
            <p style={{fontSize: 13, color: '#94A3B8', marginBottom: 14}}>Instantly creates a secure 6-digit random code and renders the previous code invalid.</p>
            <button type="button" className="auth-btn primary" id="btn-generate-random" onClick={() => { handleGenerateRandom() }} style={{padding: '10px 16px', fontSize: 14}}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
              <span>Generate New Code</span>
            </button>
          </div>
          {/* Set Custom Code */}
          <div style={{background: 'rgba(11, 31, 58, 0.6)', border: '1px solid rgba(191, 219, 254, 0.12)', borderRadius: 14, padding: 18}}>
            <h4 style={{fontSize: 14, color: '#FFFFFF', marginBottom: 6}}>Set Custom Code</h4>
            <p style={{fontSize: 13, color: '#94A3B8', marginBottom: 12}}>Define your own memorable code (4–10 digits/characters).</p>
            <div style={{display: 'flex', gap: 10}}>
              <input type="text" id="custom-code-input" placeholder="e.g. 739201" maxLength={10} style={{flex: 1, background: 'var(--input-bg)', border: '1.5px solid var(--card-border)', borderRadius: 10, color: '#FFFFFF', padding: '10px 14px', fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'monospace'}} />
              <button type="button" className="auth-btn primary" id="btn-set-custom" onClick={() => { handleSetCustom() }} style={{width: 'auto', padding: '10px 18px', fontSize: 14}}>
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
        <div style={{marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(191, 219, 254, 0.1)', fontSize: 12, color: '#64748B'}}>
          Note: Changing the code takes effect immediately across all client devices.
        </div>
      </div>
    </div>
  </div>
  {/* Firebase Compat SDKs */}
  {/* App Configuration & Authentication Gateway */}

      <Script src="/admin.js" strategy="lazyOnload" />
    </>
  );
}