import { EMPLOYER_CATEGORIES } from './employers';

// Map employer name to tier
export function getEmployerTier(employerName) {
  if (!employerName) return 'Unknown';
  if (EMPLOYER_CATEGORIES["A+"].includes(employerName)) return 'A+';
  if (EMPLOYER_CATEGORIES["A"].includes(employerName)) return 'A';
  if (EMPLOYER_CATEGORIES["B"].includes(employerName)) return 'B';
  if (EMPLOYER_CATEGORIES["C"].includes(employerName)) return 'C';
  return 'Unknown';
}

const LENDERS = [
  {
    id: "hdfc",
    name: "HDFC Bank",
    type: "Private Bank",
    headlineRate: 9.99,
    maxTenure: 60,
    priority: 10, // Higher is better
    rules: {
      pl_bt: "🟢",
      multi_pl: "🟢",
      cc_debt: "🟡",
      app_loan: "🟡",
      top_up: "🟢",
      minCibil: 720,
      minSalary: 30000,
      targetTiers: ["A+", "A"]
    }
  },
  {
    id: "icici",
    name: "ICICI Bank",
    type: "Private Bank",
    headlineRate: 10.85,
    maxTenure: 60,
    priority: 9,
    rules: {
      pl_bt: "🟢",
      multi_pl: "🟡",
      cc_debt: "🟡",
      app_loan: "🟡",
      top_up: "🟢",
      minCibil: 700,
      minSalary: 25000,
      targetTiers: ["A+", "A", "B"]
    }
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    type: "Private Bank",
    headlineRate: 10.99,
    maxTenure: 60,
    priority: 9,
    rules: {
      pl_bt: "🟢",
      multi_pl: "🟢",
      cc_debt: "🟡",
      app_loan: "🟡",
      top_up: "🟢",
      minCibil: 700,
      minSalary: 25000,
      targetTiers: ["A+", "A", "B"]
    }
  },
  {
    id: "idfc",
    name: "IDFC FIRST Bank",
    type: "Private Bank",
    headlineRate: 9.99,
    maxTenure: 60,
    priority: 9,
    rules: {
      pl_bt: "🟢",
      multi_pl: "🟡",
      cc_debt: "🟡",
      app_loan: "🟡",
      top_up: "🟢",
      minCibil: 700,
      minSalary: 25000,
      targetTiers: ["A+", "A", "B", "C"]
    }
  },
  {
    id: "indusind",
    name: "IndusInd Bank",
    type: "Private Bank",
    headlineRate: 10.49,
    maxTenure: 60,
    priority: 8,
    rules: {
      pl_bt: "🟢",
      multi_pl: "🟢",
      cc_debt: "🟢",
      app_loan: "🟡",
      top_up: "🟢",
      minCibil: 700,
      minSalary: 25000,
      targetTiers: ["A+", "A", "B"]
    }
  },
  {
    id: "bajaj",
    name: "Bajaj Finance",
    type: "NBFC",
    headlineRate: 11.00,
    maxTenure: 60,
    priority: 8,
    rules: {
      pl_bt: "🟢",
      multi_pl: "🟢",
      cc_debt: "🟢",
      app_loan: "🟡",
      top_up: "🟢",
      minCibil: 680,
      minSalary: 20000,
      targetTiers: ["A+", "A", "B", "C", "Unknown"]
    }
  },
  {
    id: "tata",
    name: "Tata Capital",
    type: "NBFC",
    headlineRate: 10.99,
    maxTenure: 60,
    priority: 8,
    rules: {
      pl_bt: "🟢",
      multi_pl: "🟢",
      cc_debt: "🟡",
      app_loan: "🟡",
      top_up: "🟢",
      minCibil: 680,
      minSalary: 20000,
      targetTiers: ["A+", "A", "B", "C", "Unknown"]
    }
  },
  {
    id: "shriram",
    name: "Shriram Finance",
    type: "NBFC",
    headlineRate: 11.50,
    maxTenure: 48,
    priority: 7,
    rules: {
      pl_bt: "🟢",
      multi_pl: "🟢",
      cc_debt: "🟢",
      app_loan: "🟡",
      top_up: "🟡",
      minCibil: 650,
      minSalary: 15000,
      targetTiers: ["A+", "A", "B", "C", "Unknown"]
    }
  },
  {
    id: "ltfinance",
    name: "L&T Finance",
    type: "NBFC",
    headlineRate: 11.00,
    maxTenure: 60,
    priority: 7,
    rules: {
      pl_bt: "🟢",
      multi_pl: "🟢",
      cc_debt: "🟡",
      app_loan: "🟡",
      top_up: "🟢",
      minCibil: 680,
      minSalary: 20000,
      targetTiers: ["A+", "A", "B", "C"]
    }
  },
  {
    id: "abfl",
    name: "Aditya Birla Finance",
    type: "NBFC",
    headlineRate: 11.99,
    maxTenure: 60,
    priority: 6,
    rules: {
      pl_bt: "🟡",
      multi_pl: "🟡",
      cc_debt: "🟡",
      app_loan: "🟡",
      top_up: "🟡",
      minCibil: 650,
      minSalary: 15000,
      targetTiers: ["A+", "A", "B", "C", "Unknown"]
    }
  }
];

export function analyzeLenderEligibility({ profile, catBLoans }) {
  const { cibil, netSalary, employer, hasBounce, hasLatePayment, hasActiveOverdue, wantsTopUp } = profile;
  const employerTier = getEmployerTier(employer);

  // Characterize the liabilities
  const plCount = catBLoans.filter(l => l.type === 'Personal Loan').length;
  const hasCC = catBLoans.some(l => l.type === 'Credit Card');
  const hasApp = catBLoans.some(l => l.type === 'App Loan');

  const requiresMultiPL = plCount > 1;
  const requiresCC = hasCC;
  const requiresApp = hasApp;
  
  let eligibleLenders = [];

  for (const lender of LENDERS) {
    const rules = lender.rules;
    
    // HARD KNOCKOUTS
    if (hasActiveOverdue === 'yes') continue; // Reject all for active overdue
    if (Number(cibil) < rules.minCibil) continue;
    if (Number(netSalary) < rules.minSalary) continue;
    
    // If they have bounce/late payment, strict Private Banks might reject
    if ((hasBounce === 'yes' || hasLatePayment === 'yes') && lender.type === 'Private Bank') {
      continue;
    }
    
    // EMPLOYER TIER CHECK
    if (!rules.targetTiers.includes(employerTier)) continue;
    
    // LIABILITY MATCH CHECK
    let matchConfidence = 100;
    
    if (plCount === 1) {
      if (rules.pl_bt === '🔴') continue;
      if (rules.pl_bt === '🟡') matchConfidence -= 20;
    }
    if (requiresMultiPL) {
      if (rules.multi_pl === '🔴') continue;
      if (rules.multi_pl === '🟡') matchConfidence -= 30;
    }
    if (requiresCC) {
      if (rules.cc_debt === '🔴') continue;
      if (rules.cc_debt === '🟡') matchConfidence -= 30;
    }
    if (requiresApp) {
      if (rules.app_loan === '🔴') continue;
      if (rules.app_loan === '🟡') matchConfidence -= 40;
    }
    if (wantsTopUp === 'yes') {
      if (rules.top_up === '🔴') continue;
      if (rules.top_up === '🟡') matchConfidence -= 20;
    }

    if (matchConfidence > 0) {
      eligibleLenders.push({
        ...lender,
        matchConfidence
      });
    }
  }

  // Sort by priority (higher is better) and then confidence
  eligibleLenders.sort((a, b) => {
    if (b.matchConfidence !== a.matchConfidence) {
      return b.matchConfidence - a.matchConfidence;
    }
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return a.headlineRate - b.headlineRate;
  });

  return eligibleLenders;
}
