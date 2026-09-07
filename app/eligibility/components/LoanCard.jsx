import { calculateEMI, getEmisPaid, calculateOutstanding } from '../../../lib/engine';

export const CATEGORY_A = ['Car Loan', 'Home Loan', 'LAP', 'Gold Loan', 'Consumer Loan'];
export const CATEGORY_B = ['Personal Loan', 'Overdraft', 'App Loan', 'Credit Card'];

export default function LoanCard({ loan, idx, removeLoan, updateLoan }) {
  const p = Number(loan.originalAmount) || 0;
  const r = Number(loan.rate) || 0;
  const n = Number(loan.tenure) || 0;
  
  const autoEmi = calculateEMI(p, r, n);
  const emisPaid = getEmisPaid(loan.disbursedDate);
  const autoOutstanding = calculateOutstanding(p, r, n, emisPaid);

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
        <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>Loan #{idx + 1}</span>
        <button type="button" onClick={() => removeLoan(loan.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="input-group">
          <label>Bank / NBFC</label>
          <div className="input-wrapper">
            <input type="text" placeholder="e.g. HDFC Bank" value={loan.bank} onChange={(e) => updateLoan(loan.id, 'bank', e.target.value)} required />
          </div>
        </div>
        <div className="input-group">
          <label>Loan Type</label>
          <div className="input-wrapper">
            <select 
              value={loan.type} 
              onChange={(e) => updateLoan(loan.id, 'type', e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '0.8rem 1rem', fontSize: '1rem', outline: 'none' }}
            >
              <optgroup label="Generally Non-Transferable (Category A)">
                {CATEGORY_A.map(t => <option key={t} value={t} style={{color:'black'}}>{t}</option>)}
              </optgroup>
              <optgroup label="Potentially Transferable (Category B)">
                {CATEGORY_B.map(t => <option key={t} value={t} style={{color:'black'}}>{t}</option>)}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Original Loan Amount</label>
          <div className="input-wrapper">
            <span className="currency">₹</span>
            <input type="number" min={1} required value={loan.originalAmount} onChange={(e) => updateLoan(loan.id, 'originalAmount', e.target.value)} />
          </div>
        </div>
        
        <div className="input-group">
          <label>Disbursed Date</label>
          <div className="input-wrapper date-wrapper">
            <input type="date" required value={loan.disbursedDate} onChange={(e) => updateLoan(loan.id, 'disbursedDate', e.target.value)} />
          </div>
        </div>

        <div className="input-group">
          <label>Interest Rate (% p.a.)</label>
          <div className="input-wrapper">
            <input type="number" step="any" min={0.1} required value={loan.rate} onChange={(e) => updateLoan(loan.id, 'rate', e.target.value)} />
            <span className="percent">%</span>
          </div>
        </div>

        <div className="input-group">
          <label>Original Tenure (Months)</label>
          <div className="input-wrapper">
            <input type="number" min={1} required value={loan.tenure} onChange={(e) => updateLoan(loan.id, 'tenure', e.target.value)} />
            <span className="unit">Mo</span>
          </div>
        </div>

        <div className="input-group">
          <label>Current Outstanding (Optional)</label>
          <div className="input-wrapper">
            <span className="currency">₹</span>
            <input 
              type="number" 
              placeholder={autoOutstanding > 0 ? Math.round(autoOutstanding).toString() : "Auto-calculated"} 
              value={loan.currentOutstanding} 
              onChange={(e) => updateLoan(loan.id, 'currentOutstanding', e.target.value)} 
            />
          </div>
        </div>

        <div className="input-group">
          <label>Monthly EMI (Optional)</label>
          <div className="input-wrapper">
            <span className="currency">₹</span>
            <input 
              type="number" 
              placeholder={autoEmi > 0 ? Math.round(autoEmi).toString() : "Auto-calculated"} 
              value={loan.emi} 
              onChange={(e) => updateLoan(loan.id, 'emi', e.target.value)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
