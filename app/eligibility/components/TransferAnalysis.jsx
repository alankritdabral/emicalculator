export default function TransferAnalysis({ catBLoans, catALoans, currentEmiB, newEmiB, interestSaving, monthlySaving, annualSaving, totalOutB, eligibleLenders, additionalAmount }) {
  const topLender = eligibleLenders && eligibleLenders.length > 0 ? eligibleLenders[0] : null;
  const NEW_RATE = topLender ? topLender.headlineRate : 11.99;
  const NEW_TENURE = topLender ? topLender.maxTenure : 60;
  
  return (
    <>
      {catBLoans.length > 0 ? (
        <div className="result-card secondary" style={{ marginTop: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="card-header">
            <div className="header-title">
              <h3>Potential Savings Options</h3>
              <span className="badge">Consolidation</span>
            </div>
          </div>
          
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            You may have options to reduce your monthly EMI by consolidating <strong>{catBLoans.length} eligible loan(s)</strong>.
            {topLender && <span> Based on your profile, <strong>{topLender.name}</strong> is a strong match.</span>}
          </p>

          <div className="comparison-details">
            <div className="detail-row">
              <span>Current EMI (Eligible Loans):</span>
              <strong>₹{currentEmiB.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
            </div>
            <div className="detail-row">
              <span>Potential New EMI*:</span>
              <strong style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>₹{newEmiB.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
            </div>

            <div className="savings-grid" style={{ marginTop: '1rem' }}>
              <div className="saving-card monthly-saving" style={{ background: 'var(--card-bg)', border: `1px solid ${monthlySaving < 0 ? 'var(--danger)' : 'var(--card-border)'}` }}>
                <span className="saving-title">{monthlySaving < 0 ? 'Additional EMI / Month' : 'Difference / Month'}</span>
                <div className="saving-amount" style={{ color: monthlySaving < 0 ? 'var(--danger)' : '' }}>
                  {monthlySaving < 0 ? '+' : '-'}₹{Math.abs(monthlySaving).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <span className="saving-badge" style={{ background: monthlySaving < 0 ? 'var(--danger-light)' : '', color: monthlySaving < 0 ? 'var(--danger)' : '' }}>
                  {monthlySaving < 0 ? 'Monthly Increase' : 'Monthly Savings'}
                </span>
              </div>
              <div className="saving-card yearly-saving" style={{ background: 'var(--card-bg)', border: `1px solid ${annualSaving < 0 ? 'var(--danger)' : 'var(--card-border)'}` }}>
                <span className="saving-title">{annualSaving < 0 ? 'Additional EMI / Year' : 'Difference / Year'}</span>
                <div className="saving-amount" style={{ color: annualSaving < 0 ? 'var(--danger)' : '' }}>
                  {annualSaving < 0 ? '+' : '-'}₹{Math.abs(annualSaving).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <span className="saving-badge" style={{ background: annualSaving < 0 ? 'var(--danger-light)' : '', color: annualSaving < 0 ? 'var(--danger)' : '' }}>
                  {annualSaving < 0 ? 'Per Year Increase' : 'Per Year Savings'}
                </span>
              </div>
            </div>
            <div className="detail-row highlight" id="total-saving-row" style={{ marginTop: '1rem', background: interestSaving < 0 ? 'var(--danger-light)' : '' }}>
              <span style={{ color: interestSaving < 0 ? 'var(--danger)' : '' }}>{interestSaving < 0 ? 'Additional Total Interest Cost:' : 'Total Overall Interest Savings:'}</span>
              <strong style={{ color: interestSaving < 0 ? 'var(--danger)' : '' }}>
                {interestSaving < 0 ? '+' : ''}₹{Math.abs(interestSaving).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </strong>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--card-bg)', border: '1px solid var(--secondary)', borderRadius: '12px' }}>
            <div style={{ fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>
              OPTION 1: Consolidate {catBLoans.length} eligible loans {additionalAmount > 0 ? `+ ₹${additionalAmount.toLocaleString('en-IN')} Top-up` : ''}
            </div>
            
            {!topLender && (
              <div style={{ margin: '1rem 0', padding: '1rem', background: 'var(--danger-light, #fee2e2)', color: 'var(--danger, #dc2626)', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>Note:</strong> Based on the profile details provided (CIBIL, employer tier, or credit history), it may be difficult to find a lender for this consolidation. The savings shown are purely illustrative.
              </div>
            )}
            
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {monthlySaving < 0 
                ? `You are borrowing an additional ₹${additionalAmount.toLocaleString('en-IN')}, which increases your EMI.` 
                : 'Best Potential EMI Reduction.'} 
              {' '}Calculated at illustrative {NEW_RATE}% p.a. for {NEW_TENURE} months based on a total new principal of ₹{(totalOutB + (additionalAmount || 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}.
            </div>
          </div>

          {eligibleLenders && eligibleLenders.length > 0 && (
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Eligible Lenders for Your Profile</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {eligibleLenders.slice(0, 5).map(lender => (
                  <li key={lender.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{lender.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lender.type} • Up to {lender.maxTenure} months</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ color: 'var(--success)', display: 'block' }}>{lender.headlineRate}%</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Starting ROI</span>
                    </div>
                  </li>
                ))}
              </ul>
              {eligibleLenders.length > 5 && (
                <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  + {eligibleLenders.length - 5} more lenders match your profile
                </div>
              )}
            </div>
          )}

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem', fontStyle: 'italic', lineHeight: 1.4 }}>
            *Illustrative estimate based on the information provided. Subject to lender approval, credit check, and final terms.
          </div>
        </div>
      ) : (
        <div className="result-card secondary" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: '1rem 0' }}>
            No potentially transferable loans (like Personal Loans or Credit Cards) found for consolidation.
          </p>
        </div>
      )}

      {/* EXCLUSIONS */}
      {catALoans.length > 0 && (
        <div style={{ marginTop: '1.5rem', background: 'var(--card-bg)', border: '1px dashed var(--card-border)', borderRadius: '12px', padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Existing Loans Not Included</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {catALoans.map(l => `${l.bank} (${l.type})`).join(', ')} are treated as fixed obligations and excluded from consolidation logic.
          </p>
        </div>
      )}
    </>
  );
}
