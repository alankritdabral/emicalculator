# Provider Eligibility Criteria and Logic

This document details how the eligibility engine (`lenderEngine.js`) determines which lenders a customer is eligible for, based on their profile, liabilities, and the lender's specific credit policies.

## How the Eligibility Engine Works

The eligibility engine evaluates a customer against a master list of lenders through a multi-step process:

### 1. Hard Knockouts (Rejections)
A lender is immediately marked as **ineligible** if the customer fails any of the following checks:
*   **Minimum Salary:** The customer's net salary is below the lender's required minimum.
*   **Active Overdues:** The customer has active overdues and the lender's policy does not strictly support it (`NOT_SUPPORTED` or `POLICY_CHECK`).
*   **Recent Bounces/Late Payments:** The customer has recent EMI bounces or late payments and the lender's policy does not strictly support it.
*   **Employer Tier:** The customer's employer tier is not in the lender's eligible list, AND the lender does not explicitly support unknown employers.
*   **Liability Takeover:** The customer has a type of liability (e.g., App Loan, Overdraft, Credit Card, Multiple PLs) or wants a Top-Up, and the lender's takeover policy for that specific feature is `NOT_SUPPORTED` or requires a `POLICY_CHECK`.

### 2. Match Scoring
If a customer passes the hard knockouts, a match confidence score (base 100) is calculated to rank the lenders:
*   **Employer Bonus:** +5 points if the customer works for an 'A+' or 'A' tier employer.
*   **Unknown Employer Penalty:** -10 points if the customer's employer tier is not directly eligible, but the lender's policy allows "unknown" employers.

Lenders are then sorted by their match confidence score (highest first) and then by their headline rate (lowest first). A score of 80 or above results in an `ELIGIBLE` status; below 80 is `CONDITIONALLY_ELIGIBLE`.

---

## Lender Policies and Values

Below is the detailed criteria for every lender currently configured in the engine.

### Group 1: Broad Support (App Loans + Credit Cards + OD + Multiple PL)

#### 1. Axis Finance
*   **Type:** NBFC
*   **Headline Rate:** 12.00% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹20,000
    *   **Eligible Employer Tiers:** A+, A, B, C (Unknowns Supported)
*   **Takeover Policy (All Confirmed):** Personal Loan, Multiple PLs, Credit Card, App Loan, Overdraft, Top Up
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)

#### 2. Poonawalla Fincorp
*   **Type:** NBFC
*   **Headline Rate:** 12.00% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹20,000
    *   **Eligible Employer Tiers:** A+, A, B, C (Unknowns Supported)
*   **Takeover Policy (All Confirmed):** Personal Loan, Multiple PLs, Credit Card, App Loan, Overdraft, Top Up
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)

#### 3. Fullerton
*   **Type:** NBFC
*   **Headline Rate:** 13.00% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹20,000
    *   **Eligible Employer Tiers:** A+, A, B, C (Unknowns Supported)
*   **Takeover Policy (All Confirmed):** Personal Loan, Multiple PLs, Credit Card, App Loan, Overdraft, Top Up
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)

---

### Group 2: Personal Loan + Credit Card Support

#### 4. Axis Bank
*   **Type:** Private Bank
*   **Headline Rate:** 9.99% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹25,000
    *   **Eligible Employer Tiers:** A+, A, B (Unknowns: Policy Check)
*   **Takeover Policy:**
    *   *Confirmed:* Personal Loan, Multiple PLs, Credit Card, Top Up
    *   *Not Supported:* App Loan, Overdraft
*   **Credit Policy:** Active Overdue (**Not Supported**), Recent Bounce (Policy Check)

#### 5. Chola
*   **Type:** NBFC
*   **Headline Rate:** 10.99% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹15,000
    *   **Eligible Employer Tiers:** A+, A, B, C (Unknowns Supported)
*   **Takeover Policy:**
    *   *Confirmed:* Personal Loan, Multiple PLs, Credit Card, Top Up
    *   *Not Supported:* App Loan, Overdraft
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)

#### 6. Tata Capital
*   **Type:** NBFC
*   **Headline Rate:** 10.99% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹20,000
    *   **Eligible Employer Tiers:** A+, A, B, C (Unknowns Supported)
*   **Takeover Policy:**
    *   *Confirmed:* Personal Loan, Multiple PLs, Credit Card, Top Up
    *   *Not Supported:* App Loan, Overdraft
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)

#### 7. Aditya Birla Finance
*   **Type:** NBFC
*   **Headline Rate:** 10.99% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹15,000
    *   **Eligible Employer Tiers:** A+, A, B, C (Unknowns Supported)
*   **Takeover Policy:**
    *   *Confirmed:* Personal Loan, Multiple PLs, Credit Card, Top Up
    *   *Not Supported:* App Loan, Overdraft
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)

#### 8. Piramal Finance
*   **Type:** NBFC
*   **Headline Rate:** 10.99% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹15,000
    *   **Eligible Employer Tiers:** A+, A, B, C (Unknowns Supported)
*   **Takeover Policy:**
    *   *Confirmed:* Personal Loan, Multiple PLs, Credit Card, Top Up
    *   *Not Supported:* App Loan, Overdraft
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)

---

### Group 3: Overdraft + Personal Loan Support

#### 9. Kotak Bank
*   **Type:** Private Bank
*   **Headline Rate:** 10.99% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹25,000
    *   **Eligible Employer Tiers:** A+, A, B (Unknowns: Policy Check)
*   **Takeover Policy:**
    *   *Confirmed:* Personal Loan, Multiple PLs, Overdraft, Top Up
    *   *Not Supported:* Credit Card, App Loan
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)

#### 10. IndusInd Bank
*   **Type:** Private Bank
*   **Headline Rate:** 10.49% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹25,000
    *   **Eligible Employer Tiers:** A+, A, B (Unknowns: Policy Check)
*   **Takeover Policy:**
    *   *Confirmed:* Personal Loan, Multiple PLs, Overdraft, Top Up
    *   *Not Supported:* Credit Card, App Loan
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)

#### 11. L&T Finance
*   **Type:** NBFC
*   **Headline Rate:** 9.99% | **Max Tenure:** 84 months
*   **Eligibility:**
    *   **Min Salary:** ₹20,000
    *   **Eligible Employer Tiers:** A+, A, B, C (Unknowns Supported)
*   **Takeover Policy:**
    *   *Confirmed:* Personal Loan, Multiple PLs, Overdraft, Top Up
    *   *Not Supported:* Credit Card, App Loan
*   **Credit Policy:** Active Overdue (Policy Check), Recent Bounce (Policy Check)
