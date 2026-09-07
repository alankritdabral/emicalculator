export default function RequirementInput({
  wantsTopUp,
  onWantsTopUpChange,
  topUpAmount,
  onTopUpAmountChange
}) {
  return (
    <div className="input-group" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text)' }}>Step 4: Requirement</h3>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        
        {/* Wants Top Up */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="label-with-hint">
            <label>Do you want additional cash after consolidation?</label>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="topup" 
                value="Yes" 
                checked={wantsTopUp === 'Yes'} 
                onChange={(e) => onWantsTopUpChange(e.target.value)} 
              /> Yes
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="topup" 
                value="No" 
                checked={wantsTopUp === 'No'} 
                onChange={(e) => {
                  onWantsTopUpChange(e.target.value);
                  onTopUpAmountChange(''); // Clear amount if they say no
                }} 
              /> No
            </label>
          </div>
        </div>

        {/* Top Up Amount (Conditional) */}
        {wantsTopUp === 'Yes' && (
          <div style={{ marginTop: '0.5rem', animation: 'slideUp 0.3s ease-out' }}>
            <div className="label-with-hint">
              <label htmlFor="topup-amount">Additional amount required</label>
            </div>
            <div className="input-wrapper" style={{ maxWidth: '300px' }}>
              <span className="currency">₹</span>
              <input
                type="number"
                id="topup-amount"
                placeholder="e.g. 100000"
                required={wantsTopUp === 'Yes'}
                min={1}
                value={topUpAmount}
                onChange={(e) => onTopUpAmountChange(e.target.value)}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
