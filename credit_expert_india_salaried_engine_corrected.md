# Credit Expert India --- Salaried Loan Eligibility & Lender Routing Engine

## 1. Scope

This engine is currently designed **only for salaried customers in
India**.

Primary use cases:

-   Personal Loan Balance Transfer
-   Debt Consolidation
-   Multiple Personal Loan consolidation
-   Credit-card debt consolidation where the lender explicitly supports
    it
-   Digital/app-loan takeover where explicitly supported
-   Top-up on eligible takeover
-   EMI reduction
-   Interest-cost reduction
-   Repayment simplification
-   Lender routing

> **Critical principle:** A lender offering a particular loan product
> does **not** automatically mean that the lender accepts every existing
> liability for takeover. Product availability and liability-takeover
> policy must be stored separately.

------------------------------------------------------------------------

# 2. Current Problems to Fix

## 2.1 Do not use universal rejection rules

The existing engine treats conditions such as active overdue and recent
bounced EMIs as universal knockouts. This is too aggressive.

Credit-risk rules should be **lender-specific**:

``` text
ACTIVE_OVERDUE → lender-specific policy
RECENT_BOUNCE → lender-specific policy
DPD_HISTORY → lender-specific policy
SETTLED_ACCOUNT → lender-specific policy
WRITE_OFF → lender-specific policy
```

Use:

-   `NOT_SUPPORTED`
-   `POLICY_CHECK`
-   `UNKNOWN`
-   `CONFIRMED`

Unknown must never automatically mean No.

------------------------------------------------------------------------

# 3. Customer Profile --- Salaried Only

Required employment fields:

``` text
employment_type = SALARIED
employer_name
employer_type
employer_tier
current_job_vintage_months
total_work_experience_months
probation_status
notice_period_days
```

Employer types:

``` text
GOVERNMENT
PSU
MNC
LARGE_PRIVATE
LISTED_COMPANY
UNLISTED_COMPANY
STARTUP
SMALL_PRIVATE
UNKNOWN
```

Employer tiers:

``` text
A+
A
B+
B
C+
C
D
UNKNOWN
```

Do not automatically reject `UNKNOWN`.

------------------------------------------------------------------------

# 4. Income Data

Collect:

``` text
monthly_net_salary
monthly_gross_salary
annual_ctc
fixed_pay
variable_pay
salary_bank
salary_credit_frequency
salary_credit_regularity
salary_slip_available
bank_statement_available
salary_credit_verified
```

For the current product, **net monthly salary** is the primary
FOIR/capacity input.

------------------------------------------------------------------------

# 5. Personal / Geographic Data

Collect:

``` text
date_of_birth
age
city
state
pincode
residence_type
residence_vintage_months
```

Support lender-specific geographic eligibility.

------------------------------------------------------------------------

# 6. Credit Profile

CIBIL alone is insufficient.

Collect:

``` text
cibil_score
recent_credit_enquiries_30d
recent_credit_enquiries_90d
recent_credit_enquiries_180d
active_credit_accounts
active_personal_loans
active_credit_cards
credit_utilization_percent
dpd_30_count
dpd_60_count
dpd_90_plus_count
active_overdue_count
active_overdue_amount
settled_accounts
written_off_accounts
bounce_count_30d
bounce_count_90d
bounce_count_180d
total_outstanding
```

Evaluate:

``` text
CIBIL
+ repayment history
+ DPD
+ overdue
+ enquiries
+ utilization
+ account status
+ income
+ FOIR
+ employment
+ lender policy
```

------------------------------------------------------------------------

# 7. Liability Schema

Each liability must be stored independently.

``` json
{
  "lender_name": "",
  "loan_type": "",
  "account_number": "",
  "original_loan_amount": 0,
  "current_outstanding": 0,
  "foreclosure_amount": 0,
  "emi": 0,
  "interest_rate": 0,
  "disbursed_date": "",
  "first_emi_date": "",
  "original_tenure_months": 0,
  "remaining_tenure_months": 0,
  "emis_paid": 0,
  "emis_remaining": 0,
  "dpd_status": "",
  "overdue_amount": 0,
  "bounce_count": 0
}
```

------------------------------------------------------------------------

# 8. Liability Types

Recommended normalized categories:

``` text
PERSONAL_LOAN
DIGITAL_PERSONAL_LOAN
CREDIT_CARD
CREDIT_CARD_EMI
CONSUMER_DURABLE_LOAN
BNPL
SALARY_ADVANCE
CREDIT_LINE
PERSONAL_OD
BUSINESS_OD
LAP_OD
FD_OD
GOLD_OD
OTHER
```

The lender policy determines whether each category can actually be taken
over.

------------------------------------------------------------------------

# 9. Product vs Takeover Policy

Do not store only:

``` text
lender.offers_personal_loan = true
```

Instead store separate takeover policies:

``` text
lender.takeover_policy.PERSONAL_LOAN
lender.takeover_policy.MULTIPLE_PERSONAL_LOANS
lender.takeover_policy.CREDIT_CARD
lender.takeover_policy.DIGITAL_PERSONAL_LOAN
lender.takeover_policy.CREDIT_LINE
lender.takeover_policy.PERSONAL_OD
```

Example:

``` json
{
  "PERSONAL_LOAN": "CONFIRMED",
  "MULTIPLE_PERSONAL_LOANS": "CONFIRMED",
  "CREDIT_CARD": "POLICY_CHECK",
  "DIGITAL_PERSONAL_LOAN": "UNKNOWN",
  "TOP_UP": "CONFIRMED"
}
```

------------------------------------------------------------------------

# 10. Policy Status System

  -----------------------------------------------------------------------
  Status                              Meaning
  ----------------------------------- -----------------------------------
  🟢 `CONFIRMED`                      Explicitly supported by reliable
                                      lender documentation

  🟡 `POLICY_CHECK`                   Potentially supported but requires
                                      lender/channel confirmation

  🔴 `NOT_SUPPORTED`                  Reliable evidence indicates it is
                                      not supported

  ⚪ `UNKNOWN`                        Not sufficiently verified
  -----------------------------------------------------------------------

Critical rule:

``` text
UNKNOWN != NOT_SUPPORTED
```

------------------------------------------------------------------------

# 11. Loan Vintage

Calculate:

``` text
loan_vintage_months
```

using:

``` text
current_date - disbursed_date
```

Retain:

``` text
first_emi_date
emis_paid
emis_remaining
repayment_track
```

Support lender-specific:

``` text
MIN_BT_VINTAGE_MONTHS
```

------------------------------------------------------------------------

# 12. Loan Amount Rules

Every lender should support:

``` text
MIN_LOAN_AMOUNT
MAX_LOAN_AMOUNT
MIN_BT_AMOUNT
MAX_BT_AMOUNT
MIN_TOPUP_AMOUNT
MAX_TOPUP_AMOUNT
```

Do not assume normal personal-loan limits equal balance-transfer limits.

------------------------------------------------------------------------

# 13. Tenure Rules

Store:

``` text
MIN_TENURE_MONTHS
MAX_TENURE_MONTHS
MIN_BT_TENURE_MONTHS
MAX_BT_TENURE_MONTHS
```

Current corrections identified:

-   **ICICI Bank:** current personal-loan balance-transfer information
    indicates tenure up to **72 months**, not 60.
-   **Tata Capital:** current balance-transfer information indicates
    tenure up to **7 years / 84 months**.
-   **Bajaj Finance:** current debt-consolidation information indicates
    tenure up to **108 months**.

Do not hardcode a universal 60-month maximum.

------------------------------------------------------------------------

# 14. Interest Rate Data

Do not store only one `interestRate`.

Store:

``` text
PUBLIC_MIN_ROI
PUBLIC_MAX_ROI
BT_MIN_ROI
BT_MAX_ROI
CUSTOMER_QUOTED_ROI
ACTUAL_OFFERED_ROI
```

The actual customer-specific offer is more important than the headline
advertised rate.

------------------------------------------------------------------------

# 15. Current Rate Corrections

### Bajaj Finance

Current debt-consolidation information indicates approximately:

``` text
10% – 30.5% p.a.
```

Therefore, storing `11%` as the general debt-consolidation rate is
misleading.

### Tata Capital

Current information indicates approximately:

``` text
10.99% – 29.99% p.a.
```

with tenure up to:

``` text
84 months
```

### ICICI Bank

Current balance-transfer information indicates:

``` text
10.85%+
12–72 months
```

with personal-loan balance transfer and top-up support described.

------------------------------------------------------------------------

# 16. FOIR / EMI Capacity

FOIR is a core part of the engine.

## Current FOIR

``` text
CURRENT_FOIR =
    existing_monthly_obligations
    / monthly_net_salary
    × 100
```

## Post-loan FOIR

``` text
POST_LOAN_FOIR =
    (existing_non_transferred_obligations + proposed_new_emi)
    / monthly_net_salary
    × 100
```

For a balance transfer, transferred EMIs should not remain in
post-transfer obligations.

Example:

``` text
Net Salary = ₹60,000
Existing EMI = ₹30,000

Current FOIR =
30,000 / 60,000 × 100
= 50%
```

If transferred liabilities become a new EMI of ₹20,000:

``` text
Post-transfer FOIR =
20,000 / 60,000 × 100
= 33.33%
```

Use lender-specific:

``` text
MAX_FOIR
```

------------------------------------------------------------------------

# 17. Top-Up Logic

Top-up is separate from balance transfer.

Collect:

``` text
topup_requested
topup_amount
```

Calculate:

``` text
total_new_loan =
    eligible_takeover_amount
    + approved_topup_amount
```

Then verify:

``` text
MAX_LOAN_AMOUNT
MAX_BT_AMOUNT
MAX_TOPUP_AMOUNT
MAX_FOIR
```

A customer can be:

``` text
BT_ELIGIBLE
```

but:

``` text
TOPUP_NOT_ELIGIBLE
```

------------------------------------------------------------------------

# 18. Hard Knockouts

Platform-level knockouts should be limited to conditions that are truly
universal.

Recommended:

``` text
employment_type != SALARIED
invalid_income
invalid_customer_data
fraud_indicator
customer_age_outside_platform_limits
```

Lender-specific conditions should normally be evaluated inside each
lender's policy:

``` text
ACTIVE_OVERDUE
RECENT_BOUNCE
DPD_90_PLUS
SETTLED_ACCOUNT
WRITE_OFF
LOW_CIBIL
```

------------------------------------------------------------------------

# 19. Lender-Specific Eligibility Rules

Example:

``` json
{
  "min_cibil": null,
  "min_salary": null,
  "max_foir": null,
  "eligible_employer_tiers": [],
  "min_age": null,
  "max_age": null,
  "min_job_vintage_months": null,
  "min_bt_vintage_months": null,

  "takeover_policy": {
    "PERSONAL_LOAN": "CONFIRMED",
    "MULTIPLE_PERSONAL_LOANS": "POLICY_CHECK",
    "CREDIT_CARD": "UNKNOWN",
    "DIGITAL_PERSONAL_LOAN": "UNKNOWN",
    "CREDIT_LINE": "UNKNOWN",
    "PERSONAL_OD": "UNKNOWN"
  },

  "credit_policy": {
    "active_overdue": "POLICY_CHECK",
    "recent_bounce": "POLICY_CHECK",
    "dpd_30": "POLICY_CHECK",
    "dpd_60": "POLICY_CHECK",
    "dpd_90_plus": "NOT_SUPPORTED",
    "settled": "POLICY_CHECK",
    "written_off": "NOT_SUPPORTED"
  }
}
```

------------------------------------------------------------------------

# 20. Employer Rules

Employer eligibility must be lender-specific.

``` json
{
  "eligible_employer_tiers": [
    "A+",
    "A",
    "B+"
  ],
  "unknown_employer_policy": "POLICY_CHECK"
}
```

Do not globally reject unknown employers.

------------------------------------------------------------------------

# 21. Replace Fixed Confidence Penalties

The existing approach uses fixed penalties such as:

``` text
Single PL       -20
Multiple PL     -30
Credit Card     -30
App Loan        -40
Top-up          -20
```

This is too simplistic.

For example:

``` text
Multiple PLs + explicit consolidation policy
```

can be a strong match.

Use weighted lender matching instead.

------------------------------------------------------------------------

# 22. Recommended Match Score

``` text
MATCH_SCORE =

  CREDIT_FIT
+ INCOME_FIT
+ FOIR_FIT
+ EMPLOYER_FIT
+ LIABILITY_FIT
+ VINTAGE_FIT
+ AMOUNT_FIT
+ TENURE_FIT
+ TOPUP_FIT
+ GEOGRAPHY_FIT
```

Suggested configurable weighting:

  Factor                         Weight
  --------------------------- ---------
  Liability/takeover fit             25
  Credit fit                         20
  FOIR/income fit                    20
  Employer fit                       10
  Loan vintage                       10
  Amount fit                          5
  Tenure fit                          5
  Top-up fit                          3
  Geography/operational fit           2
  **Total**                     **100**

------------------------------------------------------------------------

# 23. Lender Ranking

Recommended order:

``` text
1. Hard eligibility
2. Liability compatibility
3. Credit fit
4. FOIR/capacity
5. Employer fit
6. Loan vintage
7. Amount fit
8. Top-up fit
9. Operational/geographic fit
10. Actual offered ROI
11. Total customer savings
```

Do not automatically rank:

``` text
Private Bank > NBFC
```

The best lender is the lender with the best customer fit.

------------------------------------------------------------------------

# 24. ROI Should Not Be the Main Ranking Factor

A lender advertising 9.99% may not provide the customer 9.99%.

Therefore:

``` text
headline_rate
```

is informational.

When an actual offer exists, use:

``` text
ACTUAL_OFFERED_ROI
```

for financial comparison.

------------------------------------------------------------------------

# 25. Total Cost of Transfer

Calculate more than EMI.

## Existing loan cost

``` text
remaining_principal
remaining_interest
remaining_total_payment
```

## New loan cost

``` text
new_principal
new_emi
new_total_payment
new_total_interest
```

## Transfer costs

Include:

``` text
processing_fee
GST_on_processing_fee
foreclosure_charges
stamp_duty
insurance
documentation_charges
other_lender_charges
```

## Net benefit

``` text
gross_savings =
    remaining_total_payment
    - new_total_payment

net_savings =
    gross_savings
    - all_transfer_costs
```

------------------------------------------------------------------------

# 26. Customer Outcomes

Recommended outcomes:

``` text
ELIGIBLE
CONDITIONALLY_ELIGIBLE
POLICY_CHECK
NOT_ELIGIBLE
DO_NOT_TRANSFER
TOPUP_NOT_ELIGIBLE
BT_ELIGIBLE_WITHOUT_TOPUP
INSUFFICIENT_DATA
```

### DO_NOT_TRANSFER

Use when the customer technically qualifies but the economics are poor.

Example:

``` text
New EMI is lower
BUT
total net savings are negative
```

------------------------------------------------------------------------

# 27. Customer Objective

Collect the customer's primary objective:

``` text
LOWER_EMI
LOWER_INTEREST
DEBT_CONSOLIDATION
MULTIPLE_LOANS_INTO_ONE
CLOSE_CREDIT_CARDS
TOPUP
SIMPLIFY_REPAYMENTS
MAXIMUM_LOAN_AMOUNT
```

Objective should influence lender ranking.

### LOWER_EMI

Prioritize:

``` text
lower post-transfer EMI
acceptable total cost
longer eligible tenure
```

### LOWER_INTEREST

Prioritize:

``` text
lower total interest
lower ROI
shorter sensible tenure
net savings
```

------------------------------------------------------------------------

# 28. Lender Database Structure

``` text
LENDER
├── identity
├── lender_type
├── product
├── pricing
├── eligibility
├── employment_policy
├── credit_policy
├── takeover_policy
├── vintage_policy
├── amount_policy
├── tenure_policy
├── topup_policy
├── geography_policy
└── source_metadata
```

------------------------------------------------------------------------

# 29. Lender Types

Current focus:

``` text
PRIVATE_BANK
NBFC
```

Keep `lender_type` for reporting/filtering, but do not use it as an
automatic scoring advantage.

------------------------------------------------------------------------

# 30. Lender Universe

Initial examples:

### Private Banks

``` text
HDFC Bank
ICICI Bank
Kotak Mahindra Bank
IDFC FIRST Bank
IndusInd Bank
```

### NBFCs

``` text
Bajaj Finance
Tata Capital
Shriram Finance
L&T Finance
Aditya Birla Finance
```

This is only a starting set.

Recommended rollout:

``` text
Phase 1 → 15–20 thoroughly verified lenders
Phase 2 → 30–40 verified lenders
Phase 3 → 50+ verified lenders
```

Do not increase lender count by guessing policy values.

------------------------------------------------------------------------

# 31. Data Provenance

Every important lender field must have source metadata.

Recommended:

``` json
{
  "value": 720,
  "source": "official_lender_documentation",
  "source_url": "",
  "source_date": "",
  "confidence": "HIGH"
}
```

At minimum:

``` text
VALUE
SOURCE
SOURCE_DATE
CONFIDENCE
```

Recommended confidence:

``` text
HIGH
MEDIUM
LOW
UNKNOWN
```

------------------------------------------------------------------------

# 32. Source Priority

Use this priority:

``` text
1. Official lender website
2. Official lender eligibility/product documentation
3. Official lender application/channel documentation
4. Official lender FAQs
5. Regulatory/public filings
6. Reliable financial publications
7. Industry aggregators
8. Search snippets/forums
```

Third-party sources should not be treated as authoritative proof when
official documentation is available.

------------------------------------------------------------------------

# 33. Example Engine Flow

``` text
CUSTOMER INPUT
      ↓
Validate data
      ↓
Salaried-only check
      ↓
Build credit profile
      ↓
Build liability profile
      ↓
Calculate current EMI obligations
      ↓
Calculate current FOIR
      ↓
Load lender policies
      ↓
For each lender:
      ↓
Check platform-level knockout
      ↓
Check lender-specific credit policy
      ↓
Check salary
      ↓
Check age
      ↓
Check employer
      ↓
Check liability takeover compatibility
      ↓
Check loan vintage
      ↓
Check BT amount
      ↓
Calculate proposed EMI
      ↓
Calculate post-loan FOIR
      ↓
Check top-up eligibility
      ↓
Calculate total cost
      ↓
Calculate net savings
      ↓
Assign outcome
      ↓
Calculate match score
      ↓
Rank lenders
      ↓
Return customer-friendly result
```

------------------------------------------------------------------------

# 34. Recommended API Response

``` json
{
  "customer": {
    "employment_type": "SALARIED",
    "monthly_net_salary": 60000,
    "cibil_score": 760
  },

  "summary": {
    "current_emi": 30000,
    "current_foir": 50,
    "eligible_takeover_amount": 850000,
    "requested_topup": 100000
  },

  "lenders": [
    {
      "lender": "Example Lender",
      "status": "ELIGIBLE",
      "match_score": 91,
      "takeover_amount": 850000,
      "topup_amount": 100000,
      "new_loan_amount": 950000,
      "roi": 11.25,
      "tenure_months": 60,
      "new_emi": 20764,
      "post_foir": 34.61,
      "net_savings": 75000,
      "reasons": [
        "Eligible salary",
        "Credit score within policy",
        "Existing personal loans accepted for takeover",
        "Post-loan FOIR within policy"
      ],
      "warnings": []
    }
  ]
}
```

------------------------------------------------------------------------

# 35. Customer-Facing Explanation

Do not expose internal scoring complexity directly.

Show:

``` text
Your estimated eligible EMI
↓
Your current EMI burden
↓
Potential new EMI
↓
Potential monthly saving
↓
Potential total saving
↓
Best matching lenders
```

For each lender:

``` text
Why you match
What can be transferred
Estimated new EMI
Estimated saving
Top-up availability
Important conditions
```

------------------------------------------------------------------------

# 36. Data That Must Be Added Immediately

## Customer

``` text
Age / DOB
Employer type
Employer tier
Current job vintage
Total experience
Gross salary
Annual CTC
Salary bank
Salary credit regularity
Pincode
Residence vintage
```

## Credit

``` text
Recent enquiries
Credit utilization
DPD history
Active overdue amount
Settled accounts
Written-off accounts
Bounce history
```

## Liabilities

``` text
Original amount
Current outstanding
Foreclosure amount
First EMI date
Remaining tenure
EMIs paid
EMIs remaining
DPD
Overdue
Bounce count
```

## Lender policy

``` text
Min/max CIBIL
Min salary
Max FOIR
Age range
Job vintage
Employer policy
BT vintage
BT amount
Loan amount
Tenure
Top-up amount
Takeover categories
Credit-risk policy
Geography
```

------------------------------------------------------------------------

# 37. What Should Be Removed or Changed

### Remove / change

``` text
Universal active-overdue rejection
Universal recent-bounce rejection
Universal private-bank rejection for bounces
Fixed liability penalties
Private-bank-over-NBFC ranking
Single headline ROI field
60-month universal tenure assumption
Unknown = rejection
```

### Replace with

``` text
Lender-specific credit policies
Lender-specific takeover policies
Weighted match scoring
Actual offer comparison
Source-backed policy data
Policy status system
Lender-specific FOIR
Lender-specific tenure
Lender-specific amount limits
Financial-benefit calculation
```

------------------------------------------------------------------------

# 38. Production Rule

The engine must never pretend that an unverified lender policy is known.

Every decision should be traceable to:

``` text
Customer data
+
Lender policy
+
Calculation
+
Source
```

If a policy is unavailable:

``` text
status = UNKNOWN
```

If it requires manual confirmation:

``` text
status = POLICY_CHECK
```

Only explicitly supported rules should be:

``` text
status = CONFIRMED
```

------------------------------------------------------------------------

# 39. Final Architecture

The production engine should have five major layers:

``` text
1. CUSTOMER PROFILE
   ↓
2. LIABILITY ANALYZER
   ↓
3. LENDER POLICY ENGINE
   ↓
4. ELIGIBILITY + EMI + SAVINGS CALCULATOR
   ↓
5. LENDER MATCHING + RANKING
```

### Customer Profile

Determines who the customer is.

### Liability Analyzer

Determines what debt exists and what needs to be taken over.

### Lender Policy Engine

Determines what each lender accepts.

### Eligibility Calculator

Determines:

``` text
loan amount
EMI
FOIR
tenure
top-up
cost
savings
```

### Matching Engine

Determines:

``` text
best lender
second-best lender
policy-check lender
not suitable lender
do-not-transfer outcome
```

------------------------------------------------------------------------

# 40. Core Principle

The system should answer:

> **"Given this salaried customer's income, credit profile, employer,
> existing liabilities and objective, which lenders are actually
> compatible, how much can they potentially offer, what will the new EMI
> be, and is transferring the debt financially worthwhile?"**

It should **not** answer only:

> "Which lenders offer personal loans?"

That distinction is fundamental to building Credit Expert India as a
useful lender-routing and debt-consolidation engine.
