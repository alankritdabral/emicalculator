import { useState } from 'react';

function calculateEMI(p, annualRate, months) {
  if (!p || !annualRate || !months) return 0;
  if (annualRate === 0) return p / months;
  const r = annualRate / 12 / 100;
  return p * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

export default function TransferAnalysis({ catBLoans, catALoans, currentEmiB, topOptions, ineligibleLenders, eligibleLenders }) {
  const [tenureSelections, setTenureSelections] = useState({});

  const handleTenureChange = (index, value) => {
    setTenureSelections(prev => ({ ...prev, [index]: Number(value) }));
  };

  return (
    <>
      {topOptions && topOptions.length > 0 ? (
        <div className="result-card secondary" style={{ marginTop: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="card-header">
            <div className="header-title">
              <h3>Top {topOptions.length} Potential Savings Options</h3>
              <span className="badge">Consolidation & BT</span>
            </div>
          </div>
          
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            You have <strong>{catBLoans.length} eligible loan(s)</strong>. We analyzed all combinations to maximize your overall interest savings.
          </p>

          <div className="comparison-details">
            <div className="detail-row" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' }}>
              <span>Current Total EMI (Eligible Loans):</span>
              <strong>₹{currentEmiB.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
            </div>
          </div>
          
          {topOptions.map((opt, index) => {
            const selectedTenure = tenureSelections[index] || opt.base.tenure;
            const maxTenureLimit = opt.max.tenure;
            
            // Recalculate based on custom tenure selection
            const newEmi = calculateEMI(opt.newPrincipal, opt.NEW_RATE, selectedTenure);
            const totalPayment = newEmi * selectedTenure;
            const totalInterest = totalPayment - opt.newPrincipal;
            
            const totalEmi = opt.nonTransferredEmi + newEmi;
            const overallInterest = opt.nonTransferredInterest + totalInterest;
            
            const monthlySaving = opt.currentEmiB - totalEmi;
            const interestSaving = opt.currentTotalInterestB - overallInterest;

            const currentScenario = {
              tenure: selectedTenure,
              newEmi,
              totalEmi,
              monthlySaving,
              interestSaving,
              totalInterest,
              totalPayment
            };

            return (
             <div key={index} style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--card-bg)', border: index === 0 ? '2px solid var(--secondary)' : '1px solid var(--card-border)', borderRadius: '12px' }}>
               <div style={{ fontWeight: '700', color: index === 0 ? 'var(--secondary)' : 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                 <span>OPTION {index + 1}: {opt.subset.length === 1 ? 'Balance Transfer' : 'Consolidate'} {opt.subset.length} Loan(s) {opt.additionalAmount > 0 ? `+ ₹${opt.additionalAmount.toLocaleString('en-IN')} Top-up` : ''}</span>
                 {index === 0 && <span style={{ fontSize: '0.75rem', background: 'var(--secondary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>BEST OVERALL</span>}
               </div>
               
               <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                 <strong>Transferring:</strong> {opt.subset.map(l => `${l.bank} (${l.type})`).join(', ')}<br/>
                 <strong>Matched Lender:</strong> <span style={{color: 'var(--text-main)'}}>{opt.lender.name} ({opt.lender.type})</span>
               </div>

               {/* Custom Tenure Slider */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1rem', marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Adjust EMI Tenure: <span style={{color: 'var(--secondary)'}}>{selectedTenure} Months</span></label>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max: {maxTenureLimit} Months</span>
                 </div>
                 <input 
                   type="range" 
                   min="12" 
                   max={maxTenureLimit} 
                   value={selectedTenure} 
                   onChange={(e) => handleTenureChange(index, e.target.value)}
                   style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--secondary)' }}
                 />
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                   <span>Shorter (Less Interest)</span>
                   <span>Longer (Smaller EMI)</span>
                 </div>
               </div>

               {/* Full Calculations Breakdown */}
               <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--card-border)', marginBottom: '1rem' }}>
                 <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>New Loan Calculations</h4>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                   <div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loan Amount</div>
                     <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)' }}>₹{opt.newPrincipal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                   </div>
                   <div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interest Rate</div>
                     <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{opt.NEW_RATE}% p.a.</div>
                   </div>
                   <div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tenure</div>
                     <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{currentScenario.tenure} Months</div>
                   </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', background: 'var(--card-bg)', padding: '1rem', borderRadius: '6px' }}>
                   <div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>New Loan EMI</div>
                     <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--secondary)' }}>₹{currentScenario.newEmi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                   </div>
                   <div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Interest</div>
                     <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>₹{currentScenario.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                   </div>
                   <div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Payment</div>
                     <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>₹{currentScenario.totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                   </div>
                 </div>
               </div>
               
               {/* Impact & Savings Summary */}
               <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Overall Impact (Including Non-Transferred Loans)</h4>
               <div className="savings-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', display: 'grid' }}>
                 <div className="saving-card" style={{ background: 'var(--bg-main)', padding: '10px', borderRadius: '8px', border: `1px solid ${currentScenario.monthlySaving < 0 ? 'var(--danger)' : 'var(--success)'}` }}>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proposed Total EMI*</div>
                   <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>₹{currentScenario.totalEmi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                   <div style={{ fontSize: '0.75rem', color: currentScenario.monthlySaving < 0 ? 'var(--danger)' : 'var(--success)', marginTop: '4px' }}>
                     {currentScenario.monthlySaving < 0 ? `Increases by ₹${Math.abs(currentScenario.monthlySaving).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo` : `Saves ₹${Math.abs(currentScenario.monthlySaving).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo`}
                   </div>
                 </div>

                 <div className="saving-card" style={{ background: 'var(--bg-main)', padding: '10px', borderRadius: '8px', border: `1px solid ${currentScenario.interestSaving < 0 ? 'var(--danger)' : 'var(--success)'}` }}>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Interest Difference</div>
                   <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: currentScenario.interestSaving < 0 ? 'var(--danger)' : 'var(--success)' }}>
                     {currentScenario.interestSaving < 0 ? '-' : '+'}₹{Math.abs(currentScenario.interestSaving).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                   </div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Over loan lifetime</div>
                 </div>
               </div>
             </div>
            );
          })}

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem', fontStyle: 'italic', lineHeight: 1.4 }}>
            *Illustrative estimates. Proposed Total EMI includes the new loan EMI plus the EMIs of any loans you do NOT transfer. Subject to lender approval and final terms.
          </div>
        </div>
      ) : (
        <div className="result-card secondary" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: '1rem 0' }}>
            {catBLoans.length > 0 ? 'No eligible lenders found for your profile to provide a better option.' : 'No potentially transferable loans found for consolidation.'}
          </p>
        </div>
      )}

      {/* EXCLUSIONS */}
      {catALoans.length > 0 && (
        <div style={{ marginTop: '1.5rem', background: 'var(--card-bg)', border: '1px dashed var(--card-border)', borderRadius: '12px', padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Existing Loans Not Included</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {catALoans.map(l => `${l.bank} (${l.type})`).join(', ')} are treated as fixed obligations and excluded from balance transfer logic.
          </p>
        </div>
      )}

      {/* ALL ELIGIBLE LENDERS */}
      {eligibleLenders && eligibleLenders.length > 0 && (
        <div style={{ marginTop: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--success)', borderRadius: '12px', padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--success)', marginBottom: '0.75rem' }}>All Lenders Eligible for Full Consolidation</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1rem' }}>
            The following {eligibleLenders.length} lenders have approved your profile for a full debt transfer. The Top 3 options above were mathematically selected from this list.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {eligibleLenders.map((lender, i) => (
              <li key={i} style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{lender.name}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Min ROI: {lender.headlineRate}% p.a.</span>
                <span style={{ fontSize: '0.75rem', color: lender.outcome === 'ELIGIBLE' ? 'var(--success)' : 'var(--secondary)' }}>
                  {lender.outcome === 'ELIGIBLE' ? 'High Confidence' : 'Conditional Match'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* INELIGIBLE LENDERS */}
      {ineligibleLenders && ineligibleLenders.length > 0 && (
        <div style={{ marginTop: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--danger)', borderRadius: '12px', padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--danger)', marginBottom: '0.75rem' }}>Lenders Unable to Consolidate Your Full Debt</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1rem' }}>
            The following lenders cannot process a transfer for your entire eligible debt portfolio based on your current profile:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ineligibleLenders.map((lender, i) => (
              <li key={i} style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{lender.name}</strong>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {lender.reasons.map((r, idx) => <li key={idx} style={{ marginBottom: '0.2rem' }}>{r}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
