'use client';

import Script from 'next/script';

export default function Home() {
  return (
    <>

  {/* Demo Banner */}
  <div id="demo-banner" className="demo-mode-banner" style={{display: 'none'}}>
    <div className="banner-content">
      <span className="badge-pill">Demo Mode</span>
      <span>Running with simulated backend. Connect live Firebase in <code>firebase-config.js</code>.</span>
    </div>
  </div>
  {/* Floating Session Bar */}
  <aside className="session-pill-bar" id="session-bar" style={{display: 'none'}}>
    <span className="session-dot" />
    <span className="session-text" id="session-user-role">Access Active</span>
    <a href="admin.html" id="admin-shortcut-link" style={{display: 'none', color: '#93C5FD', fontSize: 12, fontWeight: 600, textDecoration: 'none', marginLeft: 4, padding: '2px 8px', borderRadius: 6, background: 'rgba(37, 99, 235, 0.2)'}}>Admin Panel</a>
    <button type="button" className="session-logout-btn" onClick={() => window.AuthSystem && window.AuthSystem.logout()}>Sign Out</button>
  </aside>
  {/* Auth Verification Loading Veil */}
  <div id="auth-loading-screen" style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0B1F3A', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16}}>
    <div className="auth-btn" style={{width: 'auto', background: 'transparent', border: 'none', boxShadow: 'none'}}>
      <div className="spinner" style={{width: 32, height: 32, borderWidth: 3, borderTopColor: '#38BDF8'}} />
    </div>
    <p style={{color: '#94A3B8', fontSize: 14, fontWeight: 500}}>Verifying daily access authorization...</p>
  </div>
  <div className="background-elements">
    <div className="blob blob-1" />
    <div className="blob blob-2" />
  </div>
  <main className="calculator-container" id="calculator-main" style={{display: 'none'}}>
    <header>
      <h1>EMI &amp; Refinance Calculator</h1>
      <p>Calculate your outstanding loan balance &amp; compare with special offer rates</p>
    </header>
    <form id="emi-form">
      {/* Total Loan Amount */}
      <div className="input-group">
        <label htmlFor="loan-amount">Total Loan Amount</label>
        <div className="input-wrapper">
          <span className="currency">₹</span>
          <input type="number" id="loan-amount" placeholder="e.g. 500000" required min={1} step="any" defaultValue={500000} />
        </div>
      </div>
      {/* Date of Loan Issued */}
      <div className="input-group">
        <div className="label-with-hint">
          <label htmlFor="loan-issue-date">Date of Loan Issued</label>
          <span className="cutoff-hint">Cutoff: 21st of month</span>
        </div>
        <div className="input-wrapper date-wrapper">
          <input type="date" id="loan-issue-date" required />
        </div>
        <div className="date-rule-explanation" id="date-rule-badge">
          <span className="rule-icon">💡</span>
          <span id="date-rule-text">Issued on or before 21st → 1st EMI starts next month | Issued after 21st → 1st EMI starts month after next</span>
        </div>
      </div>
      {/* Current Rate and Tenure */}
      <div className="input-group row">
        <div className="half">
          <label htmlFor="interest-rate">Current Interest Rate</label>
          <div className="input-wrapper">
            <input type="number" id="interest-rate" placeholder="e.g. 14.5" required min="0.1" max={100} step="any" defaultValue="14.5" />
            <span className="percent">%</span>
          </div>
        </div>
        <div className="half">
          <div className="label-with-toggle">
            <label htmlFor="tenure">Original Tenure</label>
            <div className="unit-switch" id="tenure-unit-switch">
              <button type="button" className="unit-btn active" data-unit="months">Mo</button>
              <button type="button" className="unit-btn" data-unit="years">Yr</button>
            </div>
          </div>
          <div className="input-wrapper">
            <input type="number" id="tenure" placeholder={36} required min={1} step="any" defaultValue={36} />
            <span className="unit" id="tenure-unit-label">Mo</span>
          </div>
        </div>
      </div>
      <button type="submit" className="calculate-btn" id="calculate-btn">
        <span>Calculate Outstanding &amp; Compare</span>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
    <div id="results" className="results hidden">
      {/* 1. Outstanding Amount & Loan Timeline Card */}
      <div className="result-card outstanding-card">
        <div className="card-header">
          <div className="header-title">
            <span className="card-tag tag-cyan">Loan Timeline &amp; Status</span>
          </div>
          <div className="as-of-badge" id="as-of-badge">As of Today</div>
        </div>
        {/* Timeline Schedule Badges */}
        <div className="timeline-grid">
          <div className="timeline-step">
            <span className="step-label">Issue Date</span>
            <strong className="step-value" id="display-issue-date">-</strong>
          </div>
          <div className="timeline-arrow">➔</div>
          <div className="timeline-step highlight">
            <span className="step-label">1st EMI Date</span>
            <strong className="step-value" id="display-first-emi-date">-</strong>
          </div>
          <div className="timeline-arrow">➔</div>
          <div className="timeline-step">
            <span className="step-label">EMIs Paid / Left</span>
            <strong className="step-value" id="display-emi-progress-count">0 / 0</strong>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" id="progress-bar-fill" style={{width: '0%'}} />
          </div>
          <div className="progress-bar-labels">
            <span id="progress-percent-label">0% Completed</span>
            <span id="remaining-emis-label">0 EMIs Remaining</span>
          </div>
        </div>
        {/* Hero Outstanding Principal Display */}
        <div className="outstanding-hero">
          <span className="outstanding-title">Current Outstanding</span>
          <div className="outstanding-value" id="display-outstanding-amount">₹0</div>
          <span className="outstanding-subtitle">Remaining loan balance</span>
        </div>
        {/* Sub-stats: Monthly EMI, Total Interest, Total Payment */}
        <div className="sub-stats-grid">
          <div className="stat-box">
            <span className="stat-label">Monthly EMI</span>
            <strong className="stat-value" id="display-monthly-payment">₹0</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total Interest</span>
            <strong className="stat-value" id="display-total-interest">₹0</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total Payment</span>
            <strong className="stat-value" id="display-total-repayment">₹0</strong>
          </div>
        </div>
      </div>
      {/* 2. Special Offer Refinancing Comparison on Outstanding Amount */}
      <div className="result-card secondary">
        <div className="card-header">
          <div className="header-title">
            <h3 id="offer-title"><span id="offer-rate-title">9.99</span>% Special Offer Rate</h3>
            <span className="badge">Refinance Offer</span>
          </div>
          <div className="offer-tenure-pill" id="offer-tenure-pill">Tenure: 3 Yrs (36 Mo)</div>
        </div>
        <div className="offer-base-notice">
          <span>Calculated on <strong id="offer-calculated-principal">₹0</strong> Balance to Refinance</span>
        </div>
        {/* Live Rate & Tenure Adjuster in Results */}
        <div className="result-live-adjusters">
          <div className="live-rate-adjuster">
            <label htmlFor="result-offer-rate">Offer Interest Rate:</label>
            <div className="input-wrapper mini">
              <input type="number" id="result-offer-rate" defaultValue="9.99" min={0} max={100} step="0.01" />
              <span className="percent">%</span>
            </div>
          </div>
          <div className="result-tenure-adjuster">
            <div className="adjuster-header">
              <span className="adjuster-label">Refinance Tenure:</span>
            </div>
            {/* Custom Months Direct Input */}
            <div className="custom-months-box">
              <div className="custom-months-input-group">
                <label htmlFor="result-offer-months">Tenure (Months):</label>
                <div className="input-wrapper mini tenure-input-wrapper">
                  <input type="number" id="result-offer-months" defaultValue={36} min={1} max={360} step={1} placeholder={36} />
                  <span className="unit">Mo</span>
                </div>
              </div>
              <div className="tenure-conversion-badge" id="tenure-conversion-badge">
                36 Months (3.0 Yrs)
              </div>
            </div>
          </div>
        </div>
        <div className="comparison-details">
          <div className="detail-row">
            <span>New Offer Monthly EMI:</span>
            <strong id="emi-999">₹0</strong>
          </div>
          <div className="detail-row">
            <span>New Offer Total Interest:</span>
            <strong id="offer-total-interest">₹0</strong>
          </div>
          <div className="detail-row">
            <span>New Offer Total Repayment:</span>
            <strong id="offer-total-payment">₹0</strong>
          </div>
          {/* Highlighted Differences */}
          <div className="savings-grid">
            <div className="saving-card monthly-saving">
              <span className="saving-title">Difference / Month</span>
              <div className="saving-amount" id="emi-diff">₹0</div>
              <span className="saving-badge" id="monthly-diff-label">Monthly Savings</span>
            </div>
            <div className="saving-card yearly-saving">
              <span className="saving-title">Difference / Year</span>
              <div className="saving-amount" id="year-diff">₹0</div>
              <span className="saving-badge" id="yearly-diff-label">Per Year Savings</span>
            </div>
          </div>
          <div className="detail-row highlight" id="total-saving-row">
            <span>Total Overall Savings:</span>
            <strong id="total-diff">₹0</strong>
          </div>
        </div>
      </div>
      {/* WhatsApp 3-Image Share Flow CTA */}
      <div className="whatsapp-share-cta-card">
        <div className="whatsapp-cta-header">
          <div className="whatsapp-cta-badge">
            <svg className="whatsapp-icon" width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.54 1.861.825 2.795.826h.005c3.179 0 5.766-2.587 5.767-5.766 0-3.18-2.587-5.813-5.772-5.813zm3.392 8.243c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.127-.519-1.834-.757-3.003-2.617-3.094-2.738-.09-.122-.745-.989-.745-1.886 0-.898.469-1.339.636-1.52.167-.182.366-.228.487-.228.122 0 .244.001.35.007.112.005.263-.042.411.314.155.372.53 1.29.576 1.383.046.092.077.2.015.321-.061.121-.092.197-.183.303-.092.106-.194.237-.277.318-.092.091-.188.19-.081.374.107.182.474.781 1.018 1.265.701.623 1.292.816 1.475.907.183.092.29.076.398-.046.107-.121.458-.533.58-.716.122-.182.244-.152.411-.091.168.061 1.066.502 1.249.593.182.091.304.137.35.213.045.076.045.441-.099.846z" />
            </svg>
            <span>WhatsApp Share Presentation</span>
          </div>
          <span className="dimensions-tag">1080 × 1350 px (4:5)</span>
        </div>
        <h3 className="whatsapp-cta-title">WhatsApp 3-Card Refinancing Story</h3>
        <p className="whatsapp-cta-desc">Export each standalone image individually to your device.</p>
        <div className="whatsapp-action-buttons" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <button type="button" id="download-image-1-btn" className="whatsapp-primary-btn" style={{width: '100%'}}>
            <span>Download Image 1</span>
          </button>
          <button type="button" id="download-image-2-btn" className="whatsapp-primary-btn" style={{width: '100%'}}>
            <span>Download Image 2</span>
          </button>
          <button type="button" id="download-image-3-btn" className="whatsapp-primary-btn" style={{width: '100%'}}>
            <span>Download Image 3</span>
          </button>
        </div>
      </div>
    </div>
  </main>
  {/* Bank Selection Modal */}
  <div id="bank-select-modal" className="modal-backdrop hidden" aria-hidden="true" style={{zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)'}}>
    <div className="modal-dialog" style={{maxWidth: 400, width: '100%', margin: 'auto'}}>
      <div className="modal-header">
        <h2>Select Bank</h2>
      </div>
      <div className="modal-body" style={{display: 'flex', flexDirection: 'column', gap: 12, padding: 24}}>
        <button type="button" className="bank-option-btn btn-primary-action" style={{padding: 12}} data-bank="Poonawalla Fincorp Limited">Poonawalla Fincorp Limited</button>
        <button type="button" className="bank-option-btn btn-primary-action" style={{padding: 12}} data-bank="Aditya Birla Capital Limited">Aditya Birla Capital Limited</button>
        <button type="button" className="bank-option-btn btn-primary-action" style={{padding: 12}} data-bank="Bajaj Finance Limited">Bajaj Finance Limited</button>
        <button type="button" className="bank-option-btn btn-subaction" style={{padding: 12, justifyContent: 'center'}} data-bank="None">None (Default)</button>
      </div>
    </div>
  </div>
  {/* WhatsApp Share Modal */}
  <div id="whatsapp-modal" className="modal-backdrop hidden" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-header">
        <div className="modal-title-wrap">
          <div className="modal-badge">
            <span className="dot" /> WhatsApp 3-Image Flow
          </div>
          <h2>WhatsApp Loan Refinance Flow</h2>
          <p>3 standalone 1080×1350 px presentation slides ready to share together on WhatsApp.</p>
        </div>
        <button type="button" id="close-modal-btn" className="modal-close-btn" aria-label="Close modal">✕</button>
      </div>
      {/* Visual Flow Step Indicator */}
      <div className="whatsapp-flow-banner">
        <div className="flow-step">
          <span className="flow-num">1</span>
          <span className="flow-text">Download 01, 02, 03</span>
        </div>
        <span className="flow-arrow">➔</span>
        <div className="flow-step">
          <span className="flow-num">2</span>
          <span className="flow-text">Open WhatsApp</span>
        </div>
        <span className="flow-arrow">➔</span>
        <div className="flow-step">
          <span className="flow-num">3</span>
          <span className="flow-text">Select 3 Images</span>
        </div>
      </div>
      {/* Slide Switcher Tabs */}
      <div className="slide-nav-tabs">
        <button type="button" className="slide-tab-btn active" data-slide={1}>
          <span className="slide-num">1</span>
          <span className="slide-name">Your Loan Details</span>
        </button>
        <button type="button" className="slide-tab-btn" data-slide={2}>
          <span className="slide-num">2</span>
          <span className="slide-name">Your Loan Today</span>
        </button>
        <button type="button" className="slide-tab-btn" data-slide={3}>
          <span className="slide-num">3</span>
          <span className="slide-name">Special Refinance Offer</span>
        </button>
      </div>
      {/* Preview Canvas Stage */}
      <div className="preview-stage-container">
        <div className="preview-card-viewport" id="preview-viewport">
          {/* Live preview cloned slide injected here */}
        </div>
        <div className="preview-nav-controls">
          <button type="button" id="prev-slide-btn" className="nav-arrow-btn" aria-label="Previous Slide">‹</button>
          <span className="slide-indicator-label" id="slide-indicator-label">Slide 1 of 3: 01.png</span>
          <button type="button" id="next-slide-btn" className="nav-arrow-btn" aria-label="Next Slide">›</button>
        </div>
      </div>
      {/* Actions Bar */}
      <div className="modal-actions-bar">
        <button type="button" id="modal-download-all-btn" className="btn-primary-action">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1={12} y1={15} x2={12} y2={3} />
          </svg>
          <span>Download 3 Images (01, 02, 03)</span>
        </button>
        <button type="button" id="open-whatsapp-direct-btn" className="btn-whatsapp-direct">
          <svg className="whatsapp-icon" width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.54 1.861.825 2.795.826h.005c3.179 0 5.766-2.587 5.767-5.766 0-3.18-2.587-5.813-5.772-5.813zm3.392 8.243c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.127-.519-1.834-.757-3.003-2.617-3.094-2.738-.09-.122-.745-.989-.745-1.886 0-.898.469-1.339.636-1.52.167-.182.366-.228.487-.228.122 0 .244.001.35.007.112.005.263-.042.411.314.155.372.53 1.29.576 1.383.046.092.077.2.015.321-.061.121-.092.197-.183.303-.092.106-.194.237-.277.318-.092.091-.188.19-.081.374.107.182.474.781 1.018 1.265.701.623 1.292.816 1.475.907.183.092.29.076.398-.046.107-.121.458-.533.58-.716.122-.182.244-.152.411-.091.168.061 1.066.502 1.249.593.182.091.304.137.35.213.045.076.045.441-.099.846z" />
          </svg>
          <span>Open WhatsApp</span>
        </button>
        <button type="button" id="download-current-slide-btn" className="btn-subaction">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1={12} y1={15} x2={12} y2={3} />
          </svg>
          <span id="download-single-label">Download 01.png</span>
        </button>
      </div>
      {/* WhatsApp Companion Caption Box */}
      <div className="whatsapp-caption-box">
        <div className="caption-header">
          <div className="caption-title">
            <span className="copy-icon">💬</span> WhatsApp Companion Message
          </div>
          <button type="button" id="copy-caption-btn" className="btn-copy">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span id="copy-btn-text">Copy Caption</span>
          </button>
        </div>
        <div className="caption-text" id="whatsapp-caption-text">Want to know if your current loan is costing you more than it should?
          1️⃣ Enter your current loan details
          2️⃣ See your outstanding amount &amp; remaining EMIs
          3️⃣ Compare a lower-interest refinance offer and see your potential savings
          Swipe through the 3 images to see how it works.</div>
      </div>
    </div>
  </div>
  {/* Toast Notification */}
  <div id="toast" className="toast hidden" role="alert" />
  {/* Offscreen 1080x1350 High-Res Render Stage (Not scaled, pixel-perfect 1080x1350) */}
  <div id="whatsapp-render-stage" className="render-stage" aria-hidden="true">
    {/* ================= CARD 1 ================= */}
    <div id="card-slide-1" className="share-card card-1-theme">
      <div className="card-bg-glow" />
      {/* Header */}
      <div className="card-header-bar">
        <div className="card-branding-badge">
          <span className="brand-shield" id="card1-brand-icon">◆</span>
          <span className="brand-name" id="card1-brand-name">FINANCIAL ADVISORY</span>
        </div>
      </div>
      {/* Main Heading */}
      <div className="card-heading-section">
        <h1 className="card-main-title">Your <span style={{color: '#60A5FA'}}>Loan Details</span></h1>
        <p className="card-subtitle">Here’s a quick summary of your current loan.</p>
      </div>
      {/* Form Details Display (5 fields) */}
      <div className="card-form-grid">
        {/* Field 1: Loan Amount (Hero) */}
        <div className="form-field-card highlight-field" style={{position: 'relative'}}>
          <div className="field-label-wrap">
            <span className="field-icon">₹</span>
            <span className="field-label">TOTAL LOAN AMOUNT</span>
          </div>
          <div className="field-hero-value" id="card1-loan-amount">₹5,00,000</div>
          <div className="field-note">Loan amount</div>
          <div style={{position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)', opacity: '0.9'}}>
            <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx={12} cy={5} rx={9} ry={3} />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
        </div>
        {/* Field 2: Loan Start Date */}
        <div className="form-field-card">
          <div className="field-label-wrap">
            <span className="field-icon" style={{color: '#F87171'}}>📅</span>
            <span className="field-label">LOAN DATE</span>
          </div>
          <div className="field-value" id="card1-issue-date" style={{fontSize: 28}}>15 Sept 2025</div>
          <div className="field-note">Your loan was disbursed</div>
        </div>
        {/* Field 3: First EMI */}
        <div className="form-field-card">
          <div className="field-label-wrap">
            <span className="field-icon">📅</span>
            <span className="field-label">FIRST EMI</span>
          </div>
          <div className="field-value" id="card1-first-emi" style={{fontSize: 28}}>Oct 2025</div>
          <div className="field-note">Based on 21st day rule</div>
        </div>
        {/* Field 4: Current Interest Rate */}
        <div className="form-field-card" style={{gridColumn: 'span 2'}}>
          <div className="field-label-wrap">
            <span className="field-icon">%</span>
            <span className="field-label">CURRENT INTEREST RATE</span>
          </div>
          <div className="field-value" id="card1-interest-rate">14.50% p.a.</div>
          <div className="field-note">Your current loan rate</div>
        </div>
        {/* Field 5: Loan Tenure */}
        <div className="form-field-card" style={{gridColumn: 'span 2'}}>
          <div className="field-label-wrap">
            <span className="field-icon">⏱</span>
            <span className="field-label">LOAN TENURE</span>
          </div>
          <div className="field-value" id="card1-tenure">36 Months</div>
          <div className="field-note" id="card1-tenure-years">3 Years</div>
        </div>
      </div>
      {/* Bottom Note */}
      <div style={{background: 'rgba(15, 31, 58, 0.85)', border: '1.5px solid rgba(191, 219, 254, 0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto', zIndex: 2, position: 'relative'}}>
        <span style={{background: '#3B82F6', color: 'white', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontFamily: 'serif', flexShrink: 0}}>i</span>
        <span style={{color: '#E2E8F0', fontSize: 16, fontWeight: 500}}>These details help us calculate your outstanding amount and potential savings.</span>
      </div>
    </div>
    {/* ================= CARD 2 ================= */}
    <div id="card-slide-2" className="share-card card-2-theme">
      <div className="card-bg-glow" />
      {/* Header */}
      <div className="card-header-bar">
        <div className="card-branding-badge">
          <span className="brand-shield" id="card2-brand-icon">◆</span>
          <span className="brand-name" id="card2-brand-name">FINANCIAL ADVISORY</span>
        </div>
      </div>
      {/* Main Heading */}
      <div className="card-heading-section">
        <h1 className="card-main-title">Your <span style={{color: '#60A5FA'}}>Loan Today</span></h1>
        <p className="card-subtitle">Here’s where you stand today.</p>
      </div>
      {/* Primary Highlight: Outstanding Loan Balance */}
      <div className="card-outstanding-hero" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 120, position: 'relative'}}>
        <div style={{position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)'}}>
          <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
            <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
          </svg>
        </div>
        <span className="hero-tag" style={{textAlign: 'left', margin: 0}}>CURRENT OUTSTANDING AMOUNT</span>
        <div className="hero-amount" id="card2-outstanding-amount" style={{textAlign: 'left', margin: '4px 0'}}>₹3,69,445</div>
        <div className="hero-supporting-group" style={{justifyContent: 'flex-start'}}>
          <span className="hero-subtitle">Remaining loan balance</span>
        </div>
      </div>
      {/* Loan Timeline & Progress */}
      <div className="card-timeline-section">
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, color: '#E2E8F0', fontWeight: 700, fontSize: 14, letterSpacing: 1}}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10} /><polyline points="8 12 12 16 16 12" /><line x1={12} y1={8} x2={12} y2={16} /></svg>
          LOAN TIMELINE
        </div>
        <div className="timeline-dates-row" style={{marginTop: 10}}>
          <div className="timeline-date-item">
            <span className="td-label" style={{textTransform: 'none', fontSize: 15, color: '#F1F5F9'}}>Loan Started</span>
            <strong className="td-value" id="card2-issue-month" style={{color: '#93C5FD', fontSize: 18}}>Sept 2025</strong>
          </div>
          <div className="timeline-date-item">
            <span className="td-label" style={{textTransform: 'none', fontSize: 15, color: '#F1F5F9'}}>First EMI</span>
            <strong className="td-value" id="card2-first-emi-month" style={{color: '#93C5FD', fontSize: 18}}>Oct 2025</strong>
          </div>
          <div className="timeline-date-item">
            <span className="td-label" style={{textTransform: 'none', fontSize: 15, color: '#F1F5F9'}}>Today</span>
            <strong className="td-value" id="card2-today-month" style={{color: '#F1F5F9', fontSize: 18}}>Sept 2026</strong>
          </div>
        </div>
        {/* Visual Progress Bar */}
        <div className="card-progress-wrapper" style={{marginTop: 25}}>
          <div className="progress-counts-header">
            <span className="count-paid" id="card2-emis-paid-label" style={{color: '#34D399'}}>11 EMIs PAID</span>
            <span className="count-percent" id="card2-progress-percent" style={{color: '#F8FAFC'}}>31% Completed</span>
            <span className="count-left" id="card2-emis-left-label" style={{color: '#F8FAFC'}}>25 EMIs LEFT</span>
          </div>
          <div className="card-progress-track">
            <div className="card-progress-fill" id="card2-progress-fill" style={{width: '31%', background: 'linear-gradient(90deg, #3B82F6 0%, #34D399 100%)'}} />
          </div>
        </div>
      </div>
      {/* Supporting Statistics: 3 Cards */}
      <div className="card-stats-triad" style={{gap: 12}}>
        <div className="stat-triad-card" style={{padding: '20px 12px'}}>
          <div style={{background: '#2563EB', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, marginLeft: 'auto', marginRight: 'auto', fontWeight: 'bold', fontSize: 20}}>₹</div>
          <span className="st-label">CURRENT EMI</span>
          <strong className="st-value" id="card2-current-emi">₹17,210</strong>
          <span className="st-sub">Monthly EMI</span>
        </div>
        <div className="stat-triad-card" style={{padding: '20px 12px'}}>
          <div style={{background: '#2563EB', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, marginLeft: 'auto', marginRight: 'auto', fontWeight: 'bold', fontSize: 20}}>%</div>
          <span className="st-label">TOTAL INTEREST</span>
          <strong className="st-value" id="card2-total-interest">₹1.2L</strong>
          <span className="st-sub">Interest over loan</span>
        </div>
        <div className="stat-triad-card" style={{padding: '20px 12px'}}>
          <div style={{background: '#2563EB', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, marginLeft: 'auto', marginRight: 'auto'}}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={18} y1={20} x2={18} y2={10} /><line x1={12} y1={20} x2={12} y2={4} /><line x1={6} y1={20} x2={6} y2={14} /></svg>
          </div>
          <span className="st-label">TOTAL PAYMENT</span>
          <strong className="st-value" id="card2-total-payment">₹6.2L</strong>
          <span className="st-sub">Total paid over loan</span>
        </div>
      </div>
      {/* Bottom Note */}
      <div style={{background: 'rgba(15, 31, 58, 0.85)', border: '1.5px solid rgba(191, 219, 254, 0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto', zIndex: 2, position: 'relative'}}>
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <span style={{color: '#E2E8F0', fontSize: 15, fontWeight: 500}} id="card2-bottom-note-1">You've completed 31% of your loan.</span>
          <span style={{color: '#E2E8F0', fontSize: 15, fontWeight: 500}} id="card2-bottom-note-2">You still have 25 EMIs left.</span>
        </div>
      </div>
    </div>
    {/* ================= CARD 3 ================= */}
    <div id="card-slide-3" className="share-card card-3-theme">
      <div className="card-bg-glow emerald" />
      {/* Header */}
      <div className="card-header-bar">
        <div className="card-branding-badge">
          <span className="brand-shield emerald">◆</span>
          <span className="brand-name">FINANCIAL ADVISORY</span>
        </div>
      </div>
      {/* Main Heading */}
      <div className="card-heading-section">
        <h1 className="card-main-title">Special <span style={{color: '#34D399'}}>Refinance Offer</span></h1>
        <p className="card-subtitle">See how much you could save.</p>
      </div>
      {/* 3 Comparison Stats: Current (Cut) vs New Offer (Like Image 2) */}
      <div className="card-stats-triad card3-triad">
        {/* 1. MONTHLY EMI */}
        <div className="stat-triad-card card3-stat-card">
          <div className="card3-icon-bubble">₹</div>
          <span className="st-label">MONTHLY EMI</span>
          {/* Previously paying (Cut) */}
          <div className="stat-cut-box">
            <span className="cut-rate-tag" id="card3-cut-rate-1">14.50%</span>
            <span className="cut-amount-val" id="card3-cut-emi">₹17,210</span>
          </div>
          <div className="stat-cut-arrow">↓</div>
          {/* New Offer Value */}
          <div className="stat-new-wrapper">
            <strong className="st-new-value" id="card3-new-emi">₹16,430</strong>
          </div>
          <span className="st-new-sub" id="card3-emi-sub">New EMI @ 9.99%</span>
        </div>
        {/* 2. TOTAL INTEREST */}
        <div className="stat-triad-card card3-stat-card">
          <div className="card3-icon-bubble">%</div>
          <span className="st-label">TOTAL INTEREST</span>
          {/* Previously paying (Cut) */}
          <div className="stat-cut-box">
            <span className="cut-rate-tag" id="card3-cut-rate-2">14.50%</span>
            <span className="cut-amount-val" id="card3-cut-interest">₹1.2L</span>
          </div>
          <div className="stat-cut-arrow">↓</div>
          {/* New Offer Value */}
          <div className="stat-new-wrapper">
            <strong className="st-new-value" id="card3-new-interest">₹41,308</strong>
          </div>
          <span className="st-new-sub" id="card3-interest-sub">Interest @ 9.99%</span>
        </div>
        {/* 3. TOTAL PAYMENT */}
        <div className="stat-triad-card card3-stat-card">
          <div className="card3-icon-bubble">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={18} y1={20} x2={18} y2={10} /><line x1={12} y1={20} x2={12} y2={4} /><line x1={6} y1={20} x2={6} y2={14} /></svg>
          </div>
          <span className="st-label">TOTAL PAYMENT</span>
          {/* Previously paying (Cut) */}
          <div className="stat-cut-box">
            <span className="cut-rate-tag" id="card3-cut-rate-3">14.50%</span>
            <span className="cut-amount-val" id="card3-cut-payment">₹6.2L</span>
          </div>
          <div className="stat-cut-arrow">↓</div>
          {/* New Offer Value */}
          <div className="stat-new-wrapper">
            <strong className="st-new-value" id="card3-new-payment">₹4.1L</strong>
          </div>
          <span className="st-new-sub" id="card3-payment-sub">Total Over Loan</span>
        </div>
      </div>
      {/* Savings Breakdown (Main Visual Focus) */}
      <div className="card-savings-master" style={{marginTop: 24}}>
        <div className="savings-headline">
          <span className="sparkle-icon">✨</span>
          <span style={{textTransform: 'none', fontSize: 22}}>Your Potential Savings</span>
        </div>
        <div className="savings-dual-grid">
          <div className="saving-hero-box">
            <span className="shb-label">Monthly Savings</span>
            <div className="shb-amount" id="card3-monthly-savings">₹780</div>
            <span className="shb-friendly-note">Less EMI every month</span>
          </div>
          <div className="saving-hero-box">
            <span className="shb-label">Yearly Savings</span>
            <div className="shb-amount" id="card3-yearly-savings">₹9,365</div>
            <span className="shb-friendly-note">More money saved every year</span>
          </div>
        </div>
        <div className="saving-total-banner">
          <div className="stb-text-wrap" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <span className="stb-label">Total Potential Savings</span>
              <div className="stb-amount" id="card3-total-savings">₹19,509+</div>
            </div>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
          </div>
        </div>
      </div>
      {/* Refinance Details Note */}
      <div className="card-refinance-terms" style={{display: 'flex', gap: 10, marginTop: 16}}>
        <div className="term-chip" style={{flex: 1, padding: '12px 6px', textAlign: 'center', borderRadius: 12, background: 'rgba(15, 31, 58, 0.85)', border: '1.5px solid rgba(52, 211, 153, 0.2)'}}>
          <div style={{marginBottom: 6}}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
          <span className="tc-label" style={{fontSize: 11, textTransform: 'none'}}>Balance to Refinance</span>
          <strong className="tc-value" id="card3-refinance-principal" style={{fontSize: 15}}>₹3,69,445</strong>
        </div>
        <div className="term-chip" style={{flex: 1, padding: '12px 6px', textAlign: 'center', borderRadius: 12, background: 'rgba(15, 31, 58, 0.85)', border: '1.5px solid rgba(52, 211, 153, 0.2)'}}>
          <div style={{marginBottom: 6}}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={19} y1={5} x2={5} y2={19} /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg></div>
          <span className="tc-label" style={{fontSize: 11, textTransform: 'none'}}>New Rate</span>
          <strong className="tc-value" id="card3-refinance-rate" style={{fontSize: 15}}>9.99% p.a.</strong>
        </div>
        <div className="term-chip" style={{flex: 1, padding: '12px 6px', textAlign: 'center', borderRadius: 12, background: 'rgba(15, 31, 58, 0.85)', border: '1.5px solid rgba(52, 211, 153, 0.2)'}}>
          <div style={{marginBottom: 6}}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10} /><polyline points="12 6 12 12 16 14" /></svg></div>
          <span className="tc-label" style={{fontSize: 11, textTransform: 'none'}}>New Tenure</span>
          <strong className="tc-value" id="card3-refinance-tenure" style={{fontSize: 15}}>25 Months</strong>
        </div>
      </div>
      {/* Bottom Note */}
      <div style={{background: 'rgba(15, 31, 58, 0.85)', border: '1.5px solid rgba(52, 211, 153, 0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto', zIndex: 2, position: 'relative'}}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
        <span style={{color: '#E2E8F0', fontSize: 15, fontWeight: 500}}>By refinancing, you could reduce your interest cost and become debt-free faster.</span>
      </div>
    </div>
  </div>
  {/* Authentication Guard & Session Controller */}

      <Script src="/app.js" strategy="lazyOnload" />
    </>
  );
}