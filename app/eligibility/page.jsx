'use client';

import { useState, useEffect } from 'react';
import ProfileInput from './components/ProfileInput';
import LoanManager from './components/LoanManager';
import DebtSummary from './components/DebtSummary';
import TransferAnalysis from './components/TransferAnalysis';
import { analyzeLenderEligibility } from './components/lenderEngine';
import { CATEGORY_B } from './components/LoanCard';
import CreditBehaviourInput from './components/CreditBehaviourInput';
import RequirementInput from './components/RequirementInput';

// --- Utilities ---
function calculateEMI(p, annualRate, months) {
  if (!p || !annualRate || !months) return 0;
  if (annualRate === 0) return p / months;
  const r = annualRate / 12 / 100;
  return p * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

function getEmisPaid(disbursedDate) {
  if (!disbursedDate) return 0;
  const d = new Date(disbursedDate);
  const now = new Date();
  
  let firstEmiMonthOffset = d.getDate() <= 20 ? 1 : 2;
  const firstEmiDate = new Date(d.getFullYear(), d.getMonth() + firstEmiMonthOffset, 1);
  
  let months = (now.getFullYear() - firstEmiDate.getFullYear()) * 12 + (now.getMonth() - firstEmiDate.getMonth());
  return Math.max(0, months);
}

function calculateOutstanding(p, annualRate, months, emisPaid) {
  if (!p || !annualRate || !months || emisPaid < 0) return p;
  if (emisPaid >= months) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.max(0, p - (p / months) * emisPaid);
  const emi = calculateEMI(p, annualRate, months);
  const outstanding = p * Math.pow(1+r, emisPaid) - (emi * (Math.pow(1+r, emisPaid) - 1) / r);
  return Math.max(0, outstanding);
}

export default function EligibilityPage() {
  const [netSalary, setNetSalary] = useState('');
  const [cibil, setCibil] = useState('');
  const [city, setCity] = useState('');
  const [dob, setDob] = useState('');
  const [employer, setEmployer] = useState('');
  const [employmentVintage, setEmploymentVintage] = useState('');
  
  // Step 3
  const [hasBounce, setHasBounce] = useState('');
  const [hasLatePayment, setHasLatePayment] = useState('');
  const [hasActiveOverdue, setHasActiveOverdue] = useState('');
  
  // Step 4
  const [wantsTopUp, setWantsTopUp] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');

  const [emiCapacity, setEmiCapacity] = useState(null);
  const [loans, setLoans] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedSalary = localStorage.getItem('netSalary');
    const savedCibil = localStorage.getItem('cibil');
    const savedCity = localStorage.getItem('city');
    const savedDob = localStorage.getItem('dob');
    const savedEmployer = localStorage.getItem('employer');
    const savedVintage = localStorage.getItem('employmentVintage');
    const savedLoans = localStorage.getItem('userLoans');
    const savedBounce = localStorage.getItem('hasBounce');
    const savedLate = localStorage.getItem('hasLatePayment');
    const savedOverdue = localStorage.getItem('hasActiveOverdue');
    const savedTopUp = localStorage.getItem('wantsTopUp');
    const savedTopUpAmt = localStorage.getItem('topUpAmount');
    
    if (savedSalary) {
      setNetSalary(savedSalary);
      calculateCapacity(Number(savedSalary));
    }
    if (savedCibil) setCibil(savedCibil);
    if (savedCity) setCity(savedCity);
    if (savedDob) setDob(savedDob);
    if (savedEmployer) setEmployer(savedEmployer);
    if (savedVintage) setEmploymentVintage(savedVintage);
    if (savedBounce) setHasBounce(savedBounce);
    if (savedLate) setHasLatePayment(savedLate);
    if (savedOverdue) setHasActiveOverdue(savedOverdue);
    if (savedTopUp) setWantsTopUp(savedTopUp);
    if (savedTopUpAmt) setTopUpAmount(savedTopUpAmt);

    if (savedLoans) {
      try {
        setLoans(JSON.parse(savedLoans));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveToStorage = (
    salary, newLoans, currentCibil = cibil, currentCity = city, 
    currentDob = dob, currentEmployer = employer, currentVintage = employmentVintage,
    currentBounce = hasBounce, currentLate = hasLatePayment, currentOverdue = hasActiveOverdue,
    currentTopUp = wantsTopUp, currentTopUpAmt = topUpAmount
  ) => {
    localStorage.setItem('netSalary', salary);
    localStorage.setItem('cibil', currentCibil);
    localStorage.setItem('city', currentCity);
    localStorage.setItem('dob', currentDob);
    localStorage.setItem('employer', currentEmployer);
    localStorage.setItem('employmentVintage', currentVintage);
    localStorage.setItem('userLoans', JSON.stringify(newLoans));
    localStorage.setItem('hasBounce', currentBounce);
    localStorage.setItem('hasLatePayment', currentLate);
    localStorage.setItem('hasActiveOverdue', currentOverdue);
    localStorage.setItem('wantsTopUp', currentTopUp);
    localStorage.setItem('topUpAmount', currentTopUpAmt);
  };

  const calculateCapacity = (salary) => {
    const configRatio = localStorage.getItem('emiCapacityRatio') || 0.70;
    setEmiCapacity(salary * parseFloat(configRatio));
  };

  const clearData = () => {
    localStorage.removeItem('netSalary');
    localStorage.removeItem('cibil');
    localStorage.removeItem('city');
    localStorage.removeItem('dob');
    localStorage.removeItem('employer');
    localStorage.removeItem('employmentVintage');
    localStorage.removeItem('userLoans');
    localStorage.removeItem('hasBounce');
    localStorage.removeItem('hasLatePayment');
    localStorage.removeItem('hasActiveOverdue');
    localStorage.removeItem('wantsTopUp');
    localStorage.removeItem('topUpAmount');
    
    setNetSalary('');
    setCibil('');
    setCity('');
    setDob('');
    setEmployer('');
    setEmploymentVintage('');
    setHasBounce('');
    setHasLatePayment('');
    setHasActiveOverdue('');
    setWantsTopUp('');
    setTopUpAmount('');
    
    setEmiCapacity(null);
    setLoans([]);
    setShowResults(false);
  };

  const addLoan = () => {
    const newLoans = [...loans, {
      id: Date.now().toString(),
      bank: '',
      type: 'Personal Loan',
      disbursedDate: '',
      originalAmount: '',
      currentOutstanding: '',
      rate: '',
      emi: '',
      tenure: ''
    }];
    setLoans(newLoans);
    saveToStorage(netSalary, newLoans);
  };

  const removeLoan = (id) => {
    const newLoans = loans.filter(l => l.id !== id);
    setLoans(newLoans);
    saveToStorage(netSalary, newLoans);
  };

  const updateLoan = (id, field, value) => {
    const newLoans = loans.map(l => {
      if (l.id === id) {
        return { ...l, [field]: value };
      }
      return l;
    });
    setLoans(newLoans);
    saveToStorage(netSalary, newLoans);
  };

  const handleSalaryChange = (val) => {
    setNetSalary(val);
    saveToStorage(val, loans);
  };

  // Derived calculations for summary
  const processedLoans = loans.map(l => {
    let p = Number(l.originalAmount);
    let r = Number(l.rate);
    let n = Number(l.tenure);
    
    let calculatedEmi = l.emi ? Number(l.emi) : calculateEMI(p, r, n);
    let emisPaid = getEmisPaid(l.disbursedDate);
    
    let calculatedOutstanding = l.currentOutstanding 
      ? Number(l.currentOutstanding) 
      : calculateOutstanding(p, r, n, emisPaid);

    let emisRemaining = Math.max(0, n - emisPaid);

    if (l.type === 'Credit Card') {
      calculatedOutstanding = Number(l.currentOutstanding) || 0;
      calculatedEmi = calculatedOutstanding * 0.05;
      emisRemaining = 60; // Dummy tenure for CC to show interest savings
      emisPaid = 0;
    }

    return {
      ...l,
      calculatedEmi,
      calculatedOutstanding,
      emisPaid,
      emisRemaining,
      category: CATEGORY_B.includes(l.type) && l.wantsBT !== 'no' ? 'B' : 'A'
    };
  });

  const totalOutstanding = processedLoans.reduce((sum, l) => sum + (l.calculatedOutstanding || 0), 0);
  const totalMonthlyEmi = processedLoans.reduce((sum, l) => sum + (l.calculatedEmi || 0), 0);
  const emiUsageRatio = emiCapacity ? (totalMonthlyEmi / emiCapacity) * 100 : 0;

  // Consolidation Analysis (Phase 3 & 4)
  const catBLoans = processedLoans.filter(l => l.category === 'B');
  const catALoans = processedLoans.filter(l => l.category === 'A');
  
  const totalOutB = catBLoans.reduce((sum, l) => sum + (l.calculatedOutstanding || 0), 0);
  const currentEmiB = catBLoans.reduce((sum, l) => sum + (l.calculatedEmi || 0), 0);
  const currentEmiA = catALoans.reduce((sum, l) => sum + (l.calculatedEmi || 0), 0);
  
  // Phase 5 & 6: Engine & Savings Options Computation
  const profile = {
    cibil, netSalary, employer, hasBounce, hasLatePayment, hasActiveOverdue, wantsTopUp, topUpAmount
  };
  
  const additionalAmount = (wantsTopUp === 'yes' && Number(topUpAmount) > 0) ? Number(topUpAmount) : 0;
  
  let topOptions = [];
  let globalIneligible = [];
  let globalEligible = [];
  if (catBLoans.length > 0) {
    // Generate all combinations of loans to transfer
    const subsets = [];
    const max = 1 << catBLoans.length;
    for (let i = 1; i < max; i++) {
      const subset = [];
      for (let j = 0; j < catBLoans.length; j++) {
        if ((i & (1 << j)) > 0) subset.push(catBLoans[j]);
      }
      subsets.push(subset);
    }
    
    const options = [];
    const currentTotalInterestB = catBLoans.reduce((sum, l) => sum + (l.calculatedEmi * l.emisRemaining), 0) - totalOutB;
    
    // Get globally eligible/ineligible lenders for the full combination
    const analysis = analyzeLenderEligibility({ profile, catBLoans });
    globalIneligible = analysis.ineligibleLenders;
    globalEligible = analysis.eligibleLenders;

    subsets.forEach(subset => {
      // Analyze lenders for this specific combo of loans
      const { eligibleLenders } = analyzeLenderEligibility({ profile, catBLoans: subset });
      const subsetOut = subset.reduce((sum, l) => sum + (l.calculatedOutstanding || 0), 0);
      
      const nonTransferred = catBLoans.filter(l => !subset.includes(l));
      const nonTransferredEmi = nonTransferred.reduce((sum, l) => sum + (l.calculatedEmi || 0), 0);
      const nonTransferredInterest = nonTransferred.reduce((sum, l) => sum + (l.calculatedEmi * l.emisRemaining), 0) - nonTransferred.reduce((sum, l) => sum + (l.calculatedOutstanding || 0), 0);

      eligibleLenders.forEach(lender => {
        const NEW_RATE = lender.headlineRate;
        const maxRemainingInSubset = Math.max(...subset.map(l => l.emisRemaining));
        const baseTenure = Math.min(lender.maxTenure, maxRemainingInSubset) || 12; // fallback to 12 if somehow 0
        const maxTenure = lender.maxTenure;
        
        const newPrincipal = subsetOut + additionalAmount;
        
        // --- Calculate for Base Tenure (Keep same months) ---
        const newEmiBase = calculateEMI(newPrincipal, NEW_RATE, baseTenure);
        const newInterestBase = (newEmiBase * baseTenure) - newPrincipal;
        const proposedTotalEmiBase = nonTransferredEmi + newEmiBase;
        const proposedTotalInterestBase = nonTransferredInterest + newInterestBase;
        const monthlySavingBase = currentEmiB - proposedTotalEmiBase;
        const interestSavingBase = currentTotalInterestB - proposedTotalInterestBase;
        
        // --- Calculate for Max Tenure (Minimize EMI) ---
        const newEmiMax = calculateEMI(newPrincipal, NEW_RATE, maxTenure);
        const newInterestMax = (newEmiMax * maxTenure) - newPrincipal;
        const proposedTotalEmiMax = nonTransferredEmi + newEmiMax;
        const proposedTotalInterestMax = nonTransferredInterest + newInterestMax;
        const monthlySavingMax = currentEmiB - proposedTotalEmiMax;
        const interestSavingMax = currentTotalInterestB - proposedTotalInterestMax;

        options.push({
          subset, lender, newPrincipal, 
          NEW_RATE, additionalAmount, subsetOut,
          
          nonTransferredEmi,
          nonTransferredInterest,
          currentTotalInterestB,
          currentEmiB,
          
          // Sort primary by the maximum interest savings possible in this combination
          interestSaving: interestSavingBase, 
          
          base: {
            tenure: baseTenure,
            newEmi: newEmiBase,
            totalEmi: proposedTotalEmiBase,
            monthlySaving: monthlySavingBase,
            interestSaving: interestSavingBase,
            totalInterest: newInterestBase,
            totalPayment: newEmiBase * baseTenure
          },
          max: {
            tenure: maxTenure,
            newEmi: newEmiMax,
            totalEmi: proposedTotalEmiMax,
            monthlySaving: monthlySavingMax,
            interestSaving: interestSavingMax,
            totalInterest: newInterestMax,
            totalPayment: newEmiMax * maxTenure
          }
        });
      });
    });

    // Sort options to maximize interest savings (profit)
    options.sort((a, b) => b.interestSaving - a.interestSaving);

    // Pick top 3 distinct options
    const seen = new Set();
    for (const opt of options) {
      const key = opt.subset.map(l => l.id).sort().join(',') + '_' + opt.lender.id;
      if (!seen.has(key)) {
        seen.add(key);
        topOptions.push(opt);
        if (topOptions.length === 3) break;
      }
    }
  }

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (netSalary > 0) {
      calculateCapacity(Number(netSalary));
      saveToStorage(netSalary, loans);
      setShowResults(true);
    }
  };

  return (
    <>
      <div className="background-elements">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>
      <main className="calculator-container" style={{ margin: '2rem auto', display: 'block', maxWidth: '800px', width: '90%' }}>
        <header>
          <h1>See How Much EMI You Can Manage</h1>
          <p>Enter your monthly income and existing loans to understand your current EMI burden and explore potential ways to reduce it.</p>
        </header>

        <form onSubmit={handleAnalyze}>
          <ProfileInput 
            netSalary={netSalary} 
            onSalaryChange={handleSalaryChange}
            cibil={cibil}
            onCibilChange={(val) => { setCibil(val); saveToStorage(netSalary, loans, val, city, dob, employer, employmentVintage); }}
            city={city}
            onCityChange={(val) => { setCity(val); saveToStorage(netSalary, loans, cibil, val, dob, employer, employmentVintage); }}
            dob={dob}
            onDobChange={(val) => { setDob(val); saveToStorage(netSalary, loans, cibil, city, val, employer, employmentVintage); }}
            employer={employer}
            onEmployerChange={(val) => { setEmployer(val); saveToStorage(netSalary, loans, cibil, city, dob, val, employmentVintage); }}
            employmentVintage={employmentVintage}
            onEmploymentVintageChange={(val) => { setEmploymentVintage(val); saveToStorage(netSalary, loans, cibil, city, dob, employer, val); }}
          />

          <LoanManager 
            loans={loans} 
            addLoan={addLoan} 
            removeLoan={removeLoan} 
            updateLoan={updateLoan} 
            clearData={clearData} 
          />

          <CreditBehaviourInput 
            hasBounce={hasBounce}
            onHasBounceChange={(val) => { setHasBounce(val); saveToStorage(netSalary, loans, cibil, city, dob, employer, employmentVintage, val, hasLatePayment, hasActiveOverdue, wantsTopUp, topUpAmount); }}
            hasLatePayment={hasLatePayment}
            onHasLatePaymentChange={(val) => { setHasLatePayment(val); saveToStorage(netSalary, loans, cibil, city, dob, employer, employmentVintage, hasBounce, val, hasActiveOverdue, wantsTopUp, topUpAmount); }}
            hasActiveOverdue={hasActiveOverdue}
            onHasActiveOverdueChange={(val) => { setHasActiveOverdue(val); saveToStorage(netSalary, loans, cibil, city, dob, employer, employmentVintage, hasBounce, hasLatePayment, val, wantsTopUp, topUpAmount); }}
          />

          <RequirementInput
            wantsTopUp={wantsTopUp}
            onWantsTopUpChange={(val) => { setWantsTopUp(val); saveToStorage(netSalary, loans, cibil, city, dob, employer, employmentVintage, hasBounce, hasLatePayment, hasActiveOverdue, val, topUpAmount); }}
            topUpAmount={topUpAmount}
            onTopUpAmountChange={(val) => { setTopUpAmount(val); saveToStorage(netSalary, loans, cibil, city, dob, employer, employmentVintage, hasBounce, hasLatePayment, hasActiveOverdue, wantsTopUp, val); }}
          />

          <button type="submit" className="calculate-btn">
            <span>Analyze Eligibility & Savings</span>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        {showResults && emiCapacity !== null && (
          <div className="results" style={{ display: 'block', marginTop: '3rem', animation: 'slideUp 0.5s ease-out forwards' }}>
            <DebtSummary 
              loansLength={loans.length} 
              totalOutstanding={totalOutstanding} 
              totalMonthlyEmi={totalMonthlyEmi} 
              emiUsageRatio={emiUsageRatio} 
              emiCapacity={emiCapacity}
              currentEmiA={currentEmiA}
              currentEmiB={currentEmiB}
            />

            <TransferAnalysis 
              catBLoans={catBLoans}
              catALoans={catALoans}
              currentEmiB={currentEmiB}
              topOptions={topOptions}
              ineligibleLenders={globalIneligible}
              eligibleLenders={globalEligible}
            />
          </div>
        )}
      </main>
    </>
  );
}
