export const CATEGORY_A = ['Car Loan', 'Home Loan', 'LAP', 'Gold Loan', 'Consumer Loan'];
export const CATEGORY_B = ['Personal Loan', 'Overdraft', 'App Loan', 'Credit Card'];

export function calculateEMI(p, annualRate, months) {
  if (!p || !annualRate || !months) return 0;
  if (annualRate === 0) return p / months;
  const r = annualRate / 12 / 100;
  return p * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

export function calculatePrincipalFromEMI(emi, annualRate, months) {
  if (!emi || !annualRate || !months) return 0;
  if (annualRate === 0) return emi * months;
  const r = annualRate / 12 / 100;
  return emi * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
}

export function calculateRateFromEMI(p, emi, months) {
  if (!p || !emi || !months) return 0;
  if (emi * months <= p) return 0;
  
  let low = 0.0;
  let high = 100.0;
  let mid = 0;
  
  for (let i = 0; i < 50; i++) {
    mid = (low + high) / 2;
    let guessEmi = calculateEMI(p, mid, months);
    if (guessEmi > emi) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return Number(mid.toFixed(2));
}

export function calculateTenureFromEMI(p, emi, annualRate) {
  if (!p || !emi || !annualRate) return 0;
  if (annualRate === 0) return p / emi;
  const r = annualRate / 12 / 100;
  
  if (emi <= p * r) return 0;
  
  const n = Math.log(emi / (emi - p * r)) / Math.log(1 + r);
  return Math.ceil(n);
}

export function getEmisPaid(disbursedDate) {
  if (!disbursedDate) return 0;
  const d = new Date(disbursedDate);
  const now = new Date();
  
  let firstEmiMonthOffset = d.getDate() <= 20 ? 1 : 2;
  const firstEmiDate = new Date(d.getFullYear(), d.getMonth() + firstEmiMonthOffset, 1);
  
  let months = (now.getFullYear() - firstEmiDate.getFullYear()) * 12 + (now.getMonth() - firstEmiDate.getMonth());
  return Math.max(0, months);
}

export function calculateOutstanding(p, annualRate, months, emisPaid) {
  if (!p || !annualRate || !months || emisPaid < 0) return p;
  if (emisPaid >= months) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.max(0, p - (p / months) * emisPaid);
  const emi = calculateEMI(p, annualRate, months);
  const outstanding = p * Math.pow(1+r, emisPaid) - (emi * (Math.pow(1+r, emisPaid) - 1) / r);
  return Math.max(0, outstanding);
}

export function processLoans(loans) {
  return loans.map(l => {
    const p = Number(l.originalAmount);
    const r = Number(l.rate);
    const n = Number(l.tenure);
    
    let calculatedEmi = l.emi ? Number(l.emi) : calculateEMI(p, r, n);
    let emisPaid = getEmisPaid(l.disbursedDate);
    
    let calculatedOutstanding = l.currentOutstanding 
      ? Number(l.currentOutstanding) 
      : calculateOutstanding(p, r, n, emisPaid);

    return {
      ...l,
      calculatedEmi,
      calculatedOutstanding,
      emisPaid,
      emisRemaining: Math.max(0, n - emisPaid),
      category: CATEGORY_B.includes(l.type) ? 'B' : 'A',
      isTransferable: CATEGORY_B.includes(l.type) && Math.max(0, n - emisPaid) > 0
    };
  });
}

export function analyzeCustomerDebt(salary, loans, configRatio = 0.70) {
  const estimatedEmiCapacity = salary * configRatio;
  const processedLoans = processLoans(loans);
  
  const totalOutstanding = processedLoans.reduce((sum, l) => sum + (l.calculatedOutstanding || 0), 0);
  const totalCurrentEMI = processedLoans.reduce((sum, l) => sum + (l.calculatedEmi || 0), 0);
  const emiRatio = (totalCurrentEMI / salary) * 100;
  
  const transferableLoans = processedLoans.filter(l => l.isTransferable);
  const nonTransferableLoans = processedLoans.filter(l => !l.isTransferable);
  
  return {
    salary,
    estimatedEmiCapacity,
    totalCurrentEMI,
    emiRatio,
    totalOutstanding,
    loans: processedLoans,
    transferableLoans,
    nonTransferableLoans
  };
}

export function findConsolidationOptions(transferableLoans, lenders, products) {
  if (!transferableLoans || transferableLoans.length === 0) return [];
  
  const totalOut = transferableLoans.reduce((sum, l) => sum + l.calculatedOutstanding, 0);
  const currentTotalEmi = transferableLoans.reduce((sum, l) => sum + l.calculatedEmi, 0);
  const typesToMerge = transferableLoans.map(l => l.type);
  
  // Find products that accept all these loan types and allow merge
  let options = [];
  
  for (const product of products) {
    if (!product.active || !product.mergeAllowed) continue;
    
    const acceptsAll = typesToMerge.every(t => product.acceptedSourceLoanTypes.includes(t));
    if (!acceptsAll) continue;
    
    if (totalOut < product.minimumAmount || totalOut > product.maximumAmount) continue;
    
    const lender = lenders.find(ld => ld.id === product.lenderId);
    
    // We assume max tenure for the best EMI, but we shouldn't recommend unreasonably long tenures.
    // We'll calculate a few tenure options. Let's stick to the product max tenure for now.
    const tenure = product.maximumTenureMonths;
    const roi = product.minimumROI;
    
    const estimatedEMI = calculateEMI(totalOut, roi, tenure);
    const potentialMonthlySaving = Math.max(0, currentTotalEmi - estimatedEMI);
    
    // Calculate current interest remaining
    const currentRemainingInterest = transferableLoans.reduce((sum, l) => sum + (l.calculatedEmi * l.emisRemaining), 0) - totalOut;
    const newRemainingInterest = (estimatedEMI * tenure) - totalOut;
    const estimatedInterestSaving = currentRemainingInterest - newRemainingInterest;
    
    options.push({
      lender,
      product,
      totalConsolidated: totalOut,
      indicativeROI: roi,
      tenure,
      estimatedEMI,
      potentialMonthlySaving,
      estimatedInterestSaving
    });
  }
  
  // Sort by potential monthly saving descending
  return options.sort((a, b) => b.potentialMonthlySaving - a.potentialMonthlySaving);
}
