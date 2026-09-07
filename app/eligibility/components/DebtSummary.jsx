export default function DebtSummary({ loansLength, totalOutstanding, totalMonthlyEmi, emiUsageRatio, emiCapacity, currentEmiA, currentEmiB }) {
  return (
    <div className="result-card outstanding-card">
      <div className="card-header">
        <div className="header-title">
          <span className="card-tag tag-cyan" style={{ background: 'var(--secondary)', color: 'white' }}>Current Debt Summary</span>
        </div>
      </div>
      
      <div className="sub-stats-grid" style={{ marginBottom: '1.5rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <div className="stat-box">
          <span className="stat-label">Total Loans</span>
          <strong className="stat-value">{loansLength}</strong>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Outstanding</span>
          <strong className="stat-value">₹{totalOutstanding.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Monthly EMI</span>
          <strong className="stat-value" style={{ color: emiUsageRatio > 100 ? 'var(--danger)' : 'var(--text-main)' }}>
            ₹{totalMonthlyEmi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </strong>
        </div>
        
        {/* New sections for Category A and Category B EMIs */}
        <div className="stat-box">
          <span className="stat-label" style={{ color: 'var(--text-muted)' }}>Constant EMI (Secured)</span>
          <strong className="stat-value" style={{ fontSize: '1.2rem' }}>
            ₹{currentEmiA.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </strong>
        </div>
        <div className="stat-box">
          <span className="stat-label" style={{ color: 'var(--success)' }}>Reducible EMI (Unsecured)</span>
          <strong className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--success)' }}>
            ₹{currentEmiB.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </strong>
        </div>
      </div>

      <div className="progress-bar-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>EMI-to-Income Usage</span>
          <span style={{ color: emiUsageRatio > 100 ? 'var(--danger)' : 'var(--text-main)', fontWeight: 'bold' }}>{emiUsageRatio.toFixed(1)}% Used</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${Math.min(100, emiUsageRatio)}%`, background: emiUsageRatio > 100 ? 'var(--danger)' : 'var(--secondary)' }} />
        </div>
        <div className="progress-bar-labels">
          <span>Estimated Capacity: ₹{emiCapacity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo</span>
        </div>
      </div>
      
      {emiUsageRatio > 100 && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginTop: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <span style={{ lineHeight: 1.4 }}>Your current EMI exceeds your estimated capacity. Consolidating your loans could help reduce this monthly burden.</span>
        </div>
      )}
    </div>
  );
}
