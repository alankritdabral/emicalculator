import LoanCard from './LoanCard';

export default function LoanManager({ loans, addLoan, removeLoan, updateLoan, clearData }) {
  return (
    <>
      <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: '600' }}>Now tell us about your existing loans</h3>
        <button type="button" onClick={clearData} style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Clear All Data</button>
      </div>

      {loans.map((loan, idx) => (
        <LoanCard 
          key={loan.id} 
          loan={loan} 
          idx={idx} 
          removeLoan={removeLoan} 
          updateLoan={updateLoan} 
        />
      ))}

      <button type="button" onClick={addLoan} style={{ width: '100%', padding: '1.25rem', background: 'var(--card-bg)', border: '2px dashed var(--card-border)', color: 'var(--secondary)', borderRadius: '14px', cursor: 'pointer', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
        <span style={{ fontSize: '1.2rem' }}>+</span>
        <span>Add Another Loan</span>
      </button>
    </>
  );
}
