export default function CreditBehaviourInput({
  hasBounce,
  onHasBounceChange,
  hasLatePayment,
  onHasLatePaymentChange,
  hasActiveOverdue,
  onHasActiveOverdueChange
}) {
  return (
    <div className="input-group" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text)' }}>Step 3: Credit Behaviour</h3>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        
        {/* Bounce */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="label-with-hint">
            <label>Any EMI bounce in last 6 months?</label>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="bounce" 
                value="Yes" 
                checked={hasBounce === 'Yes'} 
                onChange={(e) => onHasBounceChange(e.target.value)} 
              /> Yes
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="bounce" 
                value="No" 
                checked={hasBounce === 'No'} 
                onChange={(e) => onHasBounceChange(e.target.value)} 
              /> No
            </label>
          </div>
        </div>

        {/* Late Payment */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="label-with-hint">
            <label>Any EMI payment more than 30 days late?</label>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="late" 
                value="Yes" 
                checked={hasLatePayment === 'Yes'} 
                onChange={(e) => onHasLatePaymentChange(e.target.value)} 
              /> Yes
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="late" 
                value="No" 
                checked={hasLatePayment === 'No'} 
                onChange={(e) => onHasLatePaymentChange(e.target.value)} 
              /> No
            </label>
          </div>
        </div>

        {/* Active Overdue */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="label-with-hint">
            <label>Any active overdue?</label>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="overdue" 
                value="Yes" 
                checked={hasActiveOverdue === 'Yes'} 
                onChange={(e) => onHasActiveOverdueChange(e.target.value)} 
              /> Yes
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="overdue" 
                value="No" 
                checked={hasActiveOverdue === 'No'} 
                onChange={(e) => onHasActiveOverdueChange(e.target.value)} 
              /> No
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
