export default function RequirementInput({
  wantsTopUp,
  onWantsTopUpChange,
  topUpTenure,
  onTopUpTenureChange,
  topUpRoi,
  onTopUpRoiChange,
  topUpAmount,
  onTopUpAmountChange,
  unusedEmiCapacity,
  availableTopUpAmount,
  totalOutstanding = 0,
  totalLoanCapacity = 0
}) {
  return (
    <div className="input-group" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text)' }}>Step 4: Requirement</h3>

      <div style={{ display: 'grid', gap: '1.5rem' }}>

        {/* Wants Top Up */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="label-with-hint">
            <label>Do you want an additional loan / cash?</label>
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
                  onTopUpTenureChange(''); // Clear tenure if they say no
                }}
              /> No
            </label>
          </div>
        </div>

        {/* Top Up Tenure & ROI (Conditional) */}
        {wantsTopUp === 'Yes' && (
          <div style={{ marginTop: '0.5rem', animation: 'slideUp 0.3s ease-out' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

              <div>
                <div className="label-with-hint">
                  <label htmlFor="topup-tenure">For how many years?</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="topup-tenure"
                    placeholder="e.g. 5"
                    required={wantsTopUp === 'Yes'}
                    min={1}
                    max={30}
                    value={topUpTenure}
                    onChange={(e) => onTopUpTenureChange(e.target.value)}
                  />
                  <span className="unit">Years</span>
                </div>
              </div>

              <div>
                <div className="label-with-hint">
                  <label htmlFor="topup-roi">Expected Interest Rate</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="topup-roi"
                    placeholder="e.g. 12"
                    step="any"
                    required={wantsTopUp === 'Yes'}
                    min={1}
                    max={50}
                    value={topUpRoi}
                    onChange={(e) => onTopUpRoiChange(e.target.value)}
                  />
                  <span className="percent" style={{ paddingRight: '1rem', color: 'var(--text-muted)' }}>% p.a.</span>
                </div>
              </div>

            </div>

            {/* Custom Amount Input and Dynamic Readonly Limit */}
            {topUpTenure > 0 && unusedEmiCapacity !== undefined && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <div className="label-with-hint">
                    <label htmlFor="topup-amount">Required Loan Amount</label>
                  </div>
                  <div className="input-wrapper">
                    <span className="currency">₹</span>
                    <input
                      type="number"
                      id="topup-amount"
                      placeholder="e.g. 100000"
                      required={wantsTopUp === 'Yes'}
                      min={100000}
                      max={Math.floor(availableTopUpAmount)}
                      value={topUpAmount}
                      onChange={(e) => onTopUpAmountChange(e.target.value)}
                    />
                  </div>
                  {Number(topUpAmount) > availableTopUpAmount && (
                    <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      Cannot exceed maximum eligible amount.
                    </div>
                  )}
                </div>

                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Maximum eligible amount:
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '4px' }}>
                    ₹{Math.floor(totalLoanCapacity).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
                    ₹{Math.floor(totalOutstanding).toLocaleString('en-IN')} (outstanding) + ₹{Math.floor(availableTopUpAmount).toLocaleString('en-IN')} (new loan amount)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    *Subject to Bank Policy
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
