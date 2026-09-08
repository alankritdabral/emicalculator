import { EMPLOYER_CATEGORIES } from './employers';

// Map employer name to tier
export function getEmployerTier(employerName) {
  if (!employerName) return 'Unknown';
  if (EMPLOYER_CATEGORIES["A+"]?.includes(employerName)) return 'A+';
  if (EMPLOYER_CATEGORIES["A"]?.includes(employerName)) return 'A';
  if (EMPLOYER_CATEGORIES["B"]?.includes(employerName)) return 'B';
  if (EMPLOYER_CATEGORIES["C"]?.includes(employerName)) return 'C';
  return 'Unknown';
}

const LENDERS = [
  {
    id: "hdfc",
    name: "HDFC Bank",
    type: "Private Bank",
    headlineRate: 10.50,
    maxTenure: 60,
    eligibility: {
      min_cibil: 720,
      min_salary: 30000,
      eligible_employer_tiers: ["A+", "A"],
      unknown_employer_policy: "POLICY_CHECK"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "NOT_SUPPORTED",
      "App Loan": "NOT_SUPPORTED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "NOT_SUPPORTED",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "icici",
    name: "ICICI Bank",
    type: "Private Bank",
    headlineRate: 10.80,
    maxTenure: 72,
    eligibility: {
      min_cibil: 700,
      min_salary: 25000,
      eligible_employer_tiers: ["A+", "A", "B"],
      unknown_employer_policy: "POLICY_CHECK"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "POLICY_CHECK",
      "Credit Card": "NOT_SUPPORTED",
      "App Loan": "NOT_SUPPORTED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "kotak",
    name: "Kotak Mahindra Bank",
    type: "Private Bank",
    headlineRate: 10.99,
    maxTenure: 60,
    eligibility: {
      min_cibil: 700,
      min_salary: 25000,
      eligible_employer_tiers: ["A+", "A", "B"],
      unknown_employer_policy: "POLICY_CHECK"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "NOT_SUPPORTED",
      "App Loan": "NOT_SUPPORTED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "idfc",
    name: "IDFC FIRST Bank",
    type: "Private Bank",
    headlineRate: 9.99,
    maxTenure: 60,
    eligibility: {
      min_cibil: 700,
      min_salary: 25000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "POLICY_CHECK"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "POLICY_CHECK",
      "Credit Card": "NOT_SUPPORTED",
      "App Loan": "NOT_SUPPORTED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "indusind",
    name: "IndusInd Bank",
    type: "Private Bank",
    headlineRate: 10.49,
    maxTenure: 60,
    eligibility: {
      min_cibil: 700,
      min_salary: 25000,
      eligible_employer_tiers: ["A+", "A", "B"],
      unknown_employer_policy: "POLICY_CHECK"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "NOT_SUPPORTED",
      "App Loan": "NOT_SUPPORTED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "bajaj",
    name: "Bajaj Finance",
    type: "NBFC",
    headlineRate: 10.00,
    maxTenure: 108,
    eligibility: {
      min_cibil: 650,
      min_salary: 20000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "tata",
    name: "Tata Capital",
    type: "NBFC",
    headlineRate: 10.99,
    maxTenure: 72,
    eligibility: {
      min_cibil: 680,
      min_salary: 20000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "shriram",
    name: "Shriram Finance",
    type: "NBFC",
    headlineRate: 11.00,
    maxTenure: 60,
    eligibility: {
      min_cibil: 650,
      min_salary: 15000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "POLICY_CHECK"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "ltfinance",
    name: "L&T Finance",
    type: "NBFC",
    headlineRate: 10.50,
    maxTenure: 72,
    eligibility: {
      min_cibil: 680,
      min_salary: 20000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "abfl",
    name: "Aditya Birla Finance",
    type: "NBFC",
    headlineRate: 10.99,
    maxTenure: 60,
    eligibility: {
      min_cibil: 650,
      min_salary: 15000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "POLICY_CHECK",
      "Multiple PLs": "POLICY_CHECK",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "POLICY_CHECK"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "axis",
    name: "Axis Bank",
    type: "Private Bank",
    headlineRate: 9.99,
    maxTenure: 60,
    eligibility: {
      min_cibil: 700,
      min_salary: 25000,
      eligible_employer_tiers: ["A+", "A", "B"],
      unknown_employer_policy: "POLICY_CHECK"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "NOT_SUPPORTED",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "poonawalla",
    name: "Poonawalla Fincorp",
    type: "NBFC",
    headlineRate: 15.00,
    maxTenure: 60,
    eligibility: {
      min_cibil: 680,
      min_salary: 20000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "hdb",
    name: "HDB Financial Services",
    type: "NBFC",
    headlineRate: 15.00,
    maxTenure: 60,
    eligibility: {
      min_cibil: 650,
      min_salary: 15000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "POLICY_CHECK"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "piramal",
    name: "Piramal Finance",
    type: "NBFC",
    headlineRate: 12.99,
    maxTenure: 60,
    eligibility: {
      min_cibil: 650,
      min_salary: 15000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "POLICY_CHECK",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "POLICY_CHECK"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "chola",
    name: "Chola",
    type: "NBFC",
    headlineRate: 15.00,
    maxTenure: 60,
    eligibility: {
      min_cibil: 650,
      min_salary: 15000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "POLICY_CHECK",
      "Multiple PLs": "POLICY_CHECK",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "POLICY_CHECK"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "mahindra",
    name: "Mahindra Finance",
    type: "NBFC",
    headlineRate: 12.75,
    maxTenure: 60,
    eligibility: {
      min_cibil: 650,
      min_salary: 15000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "POLICY_CHECK",
      "Multiple PLs": "POLICY_CHECK",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "POLICY_CHECK"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "iifl",
    name: "IIFL Finance",
    type: "NBFC",
    headlineRate: 15.00,
    maxTenure: 60,
    eligibility: {
      min_cibil: 650,
      min_salary: 15000,
      eligible_employer_tiers: ["A+", "A", "B", "C"],
      unknown_employer_policy: "CONFIRMED"
    },
    takeover_policy: {
      "Personal Loan": "POLICY_CHECK",
      "Multiple PLs": "POLICY_CHECK",
      "Credit Card": "CONFIRMED",
      "App Loan": "CONFIRMED",
      "Top Up": "POLICY_CHECK"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "federal",
    name: "Federal Bank",
    type: "Private Bank",
    headlineRate: 11.99,
    maxTenure: 60,
    eligibility: {
      min_cibil: 700,
      min_salary: 25000,
      eligible_employer_tiers: ["A+", "A", "B"],
      unknown_employer_policy: "POLICY_CHECK"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "NOT_SUPPORTED",
      "App Loan": "NOT_SUPPORTED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "yesbank",
    name: "YES Bank",
    type: "Private Bank",
    headlineRate: 10.85,
    maxTenure: 72,
    eligibility: {
      min_cibil: 700,
      min_salary: 25000,
      eligible_employer_tiers: ["A+", "A", "B"],
      unknown_employer_policy: "POLICY_CHECK"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "NOT_SUPPORTED",
      "App Loan": "NOT_SUPPORTED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
    }
  },
  {

    id: "rbl",
    name: "RBL Bank",
    type: "Private Bank",
    headlineRate: 14.00,
    maxTenure: 36,
    eligibility: {
      min_cibil: 700,
      min_salary: 25000,
      eligible_employer_tiers: ["A+", "A", "B"],
      unknown_employer_policy: "POLICY_CHECK"
    },
    takeover_policy: {
      "Personal Loan": "CONFIRMED",
      "Multiple PLs": "CONFIRMED",
      "Credit Card": "NOT_SUPPORTED",
      "App Loan": "NOT_SUPPORTED",
      "Top Up": "CONFIRMED"
    },
    credit_policy: {
      active_overdue: "POLICY_CHECK",
      recent_bounce: "POLICY_CHECK",
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
  let ineligibleLenders = [];

  for (const lender of LENDERS) {
    const eligibility = lender.eligibility;
    const takeover = lender.takeover_policy;
    const creditPolicy = lender.credit_policy;

    let isEligible = true;
    let matchScore = 100; // Base score out of 100
    let rejectionReasons = [];
    
    // 1. Hard knockouts (platform level & lender specific)
    if (Number(cibil) < eligibility.min_cibil) {
      isEligible = false;
      rejectionReasons.push(`Requires minimum CIBIL of ${eligibility.min_cibil}`);
    }
    if (Number(netSalary) < eligibility.min_salary) {
      isEligible = false;
      rejectionReasons.push(`Requires minimum salary of ₹${eligibility.min_salary}`);
    }
    
    // Credit Policy Check
    if (hasActiveOverdue === 'yes') {
      if (creditPolicy.active_overdue === 'NOT_SUPPORTED' || creditPolicy.active_overdue === 'POLICY_CHECK') {
        isEligible = false;
        rejectionReasons.push(`Does not accept active overdue accounts`);
      }
    }
    
    if (hasBounce === 'yes' || hasLatePayment === 'yes') {
      if (creditPolicy.recent_bounce === 'NOT_SUPPORTED' || creditPolicy.recent_bounce === 'POLICY_CHECK') {
        isEligible = false;
        rejectionReasons.push(`Does not accept recent EMI bounces`);
      }
    }

    // Employer Policy
    if (!eligibility.eligible_employer_tiers.includes(employerTier)) {
       if (eligibility.unknown_employer_policy === 'NOT_SUPPORTED' || eligibility.unknown_employer_policy === 'POLICY_CHECK') {
           isEligible = false;
           rejectionReasons.push(`Does not support your employer category (${employerTier})`);
       } else {
           matchScore -= 10;
       }
    } else {
       if (employerTier === 'A+' || employerTier === 'A') matchScore += 5;
    }

    // Takeover Policy Compatibility (Liability Fit - Weight 25)
    let liabilityFit = 25;
    if (plCount === 1 && !requiresMultiPL && !requiresCC && !requiresApp) {
      if (takeover["Personal Loan"] === 'NOT_SUPPORTED' || takeover["Personal Loan"] === 'POLICY_CHECK') {
        isEligible = false;
        rejectionReasons.push(`Does not take over single Personal Loans`);
      }
    }
    if (requiresMultiPL) {
      if (takeover["Multiple PLs"] === 'NOT_SUPPORTED' || takeover["Multiple PLs"] === 'POLICY_CHECK') {
        isEligible = false;
        rejectionReasons.push(`Does not consolidate multiple Personal Loans`);
      }
    }
    if (requiresCC) {
      if (takeover["Credit Card"] === 'NOT_SUPPORTED' || takeover["Credit Card"] === 'POLICY_CHECK') {
        isEligible = false;
        rejectionReasons.push(`Does not take over Credit Card debt`);
      }
    }
    if (requiresApp) {
      if (takeover["App Loan"] === 'NOT_SUPPORTED' || takeover["App Loan"] === 'POLICY_CHECK') {
        isEligible = false;
        rejectionReasons.push(`Does not take over Digital/App Loans`);
      }
    }
    if (wantsTopUp === 'yes') {
      if (takeover["Top Up"] === 'NOT_SUPPORTED' || takeover["Top Up"] === 'POLICY_CHECK') {
        isEligible = false;
        rejectionReasons.push(`Does not offer Top Up on transfers`);
      }
    }

    matchScore = matchScore - 25 + liabilityFit; 
    
    // Credit Fit (Weight 20)
    const cibilScore = Number(cibil);
    let creditFit = 0;
    if (cibilScore >= 750) creditFit = 20;
    else if (cibilScore >= 700) creditFit = 15;
    else if (cibilScore >= 650) creditFit = 10;
    else creditFit = 5;
    matchScore = matchScore - 20 + creditFit;

    if (isEligible) {
      eligibleLenders.push({
        ...lender,
        matchConfidence: matchScore,
        outcome: matchScore >= 80 ? 'ELIGIBLE' : 'CONDITIONALLY_ELIGIBLE'
      });
    } else {
      ineligibleLenders.push({
        ...lender,
        reasons: rejectionReasons
      });
    }
  }

  eligibleLenders.sort((a, b) => {
    if (b.matchConfidence !== a.matchConfidence) {
      return b.matchConfidence - a.matchConfidence;
    }
    return a.headlineRate - b.headlineRate;
  });

  return { eligibleLenders, ineligibleLenders };
}
