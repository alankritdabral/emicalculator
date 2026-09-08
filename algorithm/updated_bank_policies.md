# Credit Expert India

# Lender Policy & Debt Consolidation Master Database

**Version:** 1.0
**Last verified:** September 2026
**Target customer:** Salaried applicants
**Primary use:** Personal-loan eligibility, debt consolidation, balance transfer and lender matching
**Coverage:** 20 Indian Banks / NBFCs

---

# 1. Purpose

This document defines the lender-policy database that powers the Credit Expert India eligibility engine.

The database must answer:

1. Can the customer potentially qualify for this lender?
2. What is the lender's advertised interest-rate range?
3. What loan tenure is available?
4. What minimum income is published?
5. What CIBIL level is suitable?
6. Does the lender support personal-loan balance transfer?
7. Can multiple personal loans potentially be consolidated?
8. Can credit-card outstanding be considered?
9. Can digital/app-originated loans be considered?
10. Can a top-up be offered?
11. What credit conditions can cause rejection?
12. What employment conditions matter?
13. What information is confirmed versus requiring policy verification?
14. What should Credit Expert India calculate internally?

---

# 2. CRITICAL DATABASE RULE

## Never confuse these three things

### A. Lender-published policy

This is information explicitly published by the lender.

Example:

```text
IDFC FIRST Bank
CIBIL: 710+
Tenure: 9–60 months
Starting ROI: 9.99%
```

### B. Credit Expert India internal rule

This is YOUR underwriting/scoring rule.

Example:

```text
Credit Expert India preferred CIBIL:
750+

Credit Expert India preferred employer:
A / A+

Credit Expert India maximum FOIR:
50%
```

This must never be represented to the customer as:

> "The bank requires 750 CIBIL."

unless the bank itself confirms that.

### C. Policy Check

The lender may support the product, but public information does not establish the exact underwriting condition.

Use:

```text
POLICY_CHECK
```

rather than guessing.

---

# 3. STATUS ENUMS

Every policy field must use one of these values.

```text
CONFIRMED
POLICY_CHECK
NOT_SUPPORTED
PRODUCT_DEPENDENT
```

## CONFIRMED

Use only when reliable lender information explicitly supports the feature.

## POLICY_CHECK

The feature may be possible, but the exact underwriting rule is not publicly established.

## NOT_SUPPORTED

Use only when the lender/product explicitly excludes the feature.

## PRODUCT_DEPENDENT

The answer changes according to:

* product
* customer segment
* existing relationship
* loan amount
* city
* employer
* CIBIL
* tenure
* internal lender policy

---

# 4. IMPORTANT TERMINOLOGY

Do not use the generic term:

```text
App Loan
```

as a lender takeover category.

An "app loan" can actually be originated by:

* a bank
* an NBFC
* a fintech
* an embedded-finance provider
* a digital lending platform

Instead use:

```text
DIGITAL_LENDER_LOAN
FINTECH_LOAN
PERSONAL_LOAN
PERSONAL_LOAN_BALANCE_TRANSFER
MULTIPLE_PERSONAL_LOANS
CREDIT_CARD_OUTSTANDING
CREDIT_CARD_BALANCE_TRANSFER
CONSUMER_DURABLE_LOAN
TOP_UP
```

---

# 5. LENDER MASTER TABLE

| #  | Lender                 | Type         | Advertised starting ROI |       Maximum verified / usable tenure | Current database status |
| -- | ---------------------- | ------------ | ----------------------: | -------------------------------------: | ----------------------- |
| 1  | HDFC Bank              | Private Bank |  ~10.90% published page |                                    60M | 🟡                      |
| 2  | ICICI Bank             | Private Bank |                   9.99% |                      Product-dependent | 🟢                      |
| 3  | Kotak Mahindra Bank    | Private Bank |                  10.99% |                                    60M | 🟢                      |
| 4  | IDFC FIRST Bank        | Private Bank |                   9.99% |             60M / 84M specific product | 🟢                      |
| 5  | IndusInd Bank          | Private Bank |                  10.49% |                      Product-dependent | 🟢                      |
| 6  | Bajaj Finance          | NBFC         |                  10.00% |                                   108M | 🟢                      |
| 7  | Tata Capital           | NBFC         |                  10.99% |                                    72M | 🟢                      |
| 8  | Shriram Finance        | NBFC         |                  11.00% |                                    60M | 🟢                      |
| 9  | L&T Finance            | NBFC         |                  10.50% |                                    72M | 🟢                      |
| 10 | Aditya Birla Finance   | NBFC         |                 ~10.99% |                      Product-dependent | 🟡                      |
| 11 | Axis Bank              | Private Bank |                   9.99% |     Product/calculator shows up to 84M | 🟢                      |
| 12 | Poonawalla Fincorp     | NBFC         |     Not safely verified |                    Not safely verified | 🔴                      |
| 13 | HDB Financial Services | NBFC         |     Not safely verified |                      Product-dependent | 🔴                      |
| 14 | Piramal Finance        | NBFC         |                  12.99% |                                    60M | 🟢                      |
| 15 | Chola                  | NBFC         |     Not safely verified |                      Product-dependent | 🔴                      |
| 16 | Mahindra Finance       | NBFC         |       Product-dependent |                                    60M | 🟢                      |
| 17 | IIFL Finance           | NBFC         |       Product-dependent |                      Product-dependent | 🟡                      |
| 18 | Federal Bank           | Private Bank |                 11.99%+ |                      Product-dependent | 🟡                      |
| 19 | YES Bank               | Private Bank |                  10.85% |                                    72M | 🟢                      |
| 20 | RBL Bank               | Private Bank |       Product-dependent | 36M for verified pre-qualified product | 🟡                      |

---

# 6. HDFC BANK

## Basic

```yaml
id: hdfc
name: HDFC Bank
type: PRIVATE_BANK
```

## Public eligibility

HDFC's published eligibility includes:

* Age: 21–60
* Salaried applicants
* Private limited companies
* Public-sector organisations
* Central/state/local bodies
* Minimum 2 years employment
* Minimum 1 year with current employer
* Minimum ₹25,000 net monthly income

HDFC also explicitly lists debt consolidation as a personal-loan use case.

Source:
HDFC Bank published eligibility criteria.

## Interest

The lender page currently available publicly lists salaried personal-loan rates around:

```text
10.90% – 24%
```

Therefore:

```yaml
advertised_min_roi: 10.90
advertised_max_roi: 24.00
```

Do NOT use 10.50% from the old database as a current verified value.

## Tenure

Use:

```yaml
max_tenure_months: 60
```

unless modelling another HDFC product.

## Credit

Recommended internal structure:

```yaml
published_min_cibil: null
credit_expert_preferred_cibil: 750
credit_expert_internal_floor: 720
```

Do not claim that 720 is an official universal HDFC rejection cutoff.

## Consolidation

```yaml
personal_loan:
  status: CONFIRMED

multiple_personal_loans:
  status: PRODUCT_DEPENDENT

credit_card:
  status: POLICY_CHECK

digital_lender_loan:
  status: POLICY_CHECK

top_up:
  status: PRODUCT_DEPENDENT
```

## Employment

```yaml
minimum_total_employment_months: 24
minimum_current_employer_months: 12
```

---

# 7. ICICI BANK

## Basic

```yaml
id: icici
name: ICICI Bank
type: PRIVATE_BANK
```

## Interest

Current ICICI published personal-loan page:

```text
9.99% – 16.50% p.a.
```

The page states that the final rate depends on:

* customer segment
* asset category
* location
* credit profile
* income
* repayment history
* employer category
* existing relationship

Source: ICICI Bank Personal Loan Interest Rates 2026.

## Tenure

Do not hard-code the old:

```text
72 months
```

unless the exact product is identified.

Use:

```yaml
tenure:
  status: PRODUCT_DEPENDENT
```

## CIBIL

ICICI's current FAQ says:

```text
750+ = stronger profile
below 700 = stricter eligibility / possible rejection
```

Therefore:

```yaml
published_reference_cibil: 700
preferred_cibil: 750
```

## Consolidation

```yaml
personal_loan_balance_transfer: CONFIRMED
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: PRODUCT_DEPENDENT
```

---

# 8. KOTAK MAHINDRA BANK

```yaml
id: kotak
name: Kotak Mahindra Bank
type: PRIVATE_BANK
```

## Interest

```yaml
advertised_min_roi: 10.99
```

## Tenure

```yaml
max_tenure_months: 60
```

## Internal eligibility

Current database:

```yaml
internal_min_cibil: 700
minimum_salary_reference: 25000
```

These should be treated as Credit Expert India screening values unless backed by a specific lender product document.

## Consolidation

```yaml
personal_loan_balance_transfer: CONFIRMED
multiple_personal_loans: CONFIRMED
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: PRODUCT_DEPENDENT
```

---

# 9. IDFC FIRST BANK

This lender requires special treatment because it has multiple personal-loan journeys.

## FIRSTmoney

Current official information:

```text
ROI: starting 9.99%
Amount: ₹50,000–₹15 lakh
Tenure: 9–60 months
CIBIL: 710+
Age: 21–60
Foreclosure: zero
```

IDFC FIRST explicitly lists debt consolidation as a use case.

Source: IDFC FIRST Bank current personal-loan page.

## Higher-limit personal loan

A separate IDFC FIRST product currently advertises:

```text
Loan amount: up to ₹1 crore
Tenure: 12–84 months
ROI: starting 9.99%
CIBIL: 730+ ideal
Debt consolidation: supported
```

Therefore the database must NOT store one generic tenure.

Use:

```yaml
products:

  firstmoney:
    min_tenure: 9
    max_tenure: 60
    min_cibil: 710

  higher_limit:
    min_tenure: 12
    max_tenure: 84
    preferred_cibil: 730
```

This is an excellent example of why your original single `maxTenure` field is insufficient.

---

# 10. INDUSIND BANK

```yaml
id: indusind
```

## Interest

```yaml
starting_roi: 10.49
```

## Eligibility

Current lender information supports:

```text
Minimum income: ₹25,000
Total work experience: 2 years
Current organisation: 1 year
CIBIL: 730+ preferred
```

## Tenure

Do not store 84 months as a generic value.

Use product-specific tenure:

```yaml
regular_personal_loan:
  tenure: PRODUCT_DEPENDENT

online_personal_loan:
  max_tenure: 48
```

## Consolidation

IndusInd explicitly supports debt consolidation.

```yaml
personal_loan_balance_transfer: CONFIRMED
multiple_personal_loans: PRODUCT_DEPENDENT
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
```

---

# 11. BAJAJ FINANCE

## Current public product

```yaml
id: bajaj
type: NBFC
```

Current public information:

```text
ROI: 10%–30.5%
Tenure: 12–108 months
CIBIL reference: 650+
Loan amount: up to ₹55 lakh
```

Therefore:

```yaml
advertised_min_roi: 10.00
advertised_max_roi: 30.50
min_cibil_reference: 650
max_tenure_months: 108
```

## Correction to current database

Do not use:

```yaml
unknown_employer_policy: CONFIRMED
```

Use:

```yaml
unknown_employer_policy: POLICY_CHECK
```

Employer acceptance is an underwriting variable.

## Consolidation

Do not automatically mark all of these as confirmed:

```text
Credit Card
App Loan
Multiple PL
```

Instead:

```yaml
personal_loan: CONFIRMED
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: PRODUCT_DEPENDENT
```

---

# 12. TATA CAPITAL

## Interest

```yaml
starting_roi: 10.99
```

## Tenure

```yaml
min_tenure: 12
max_tenure: 72
```

Your database should therefore use:

```yaml
maxTenure: 72
```

not 84.

## Salary

Tata Capital product pages can show lower minimum salary figures, but actual approval depends on profile and underwriting.

Therefore:

```yaml
lender_min_salary_reference: PRODUCT_DEPENDENT
```

Do not represent ₹20,000 as a universal Tata Capital requirement.

## Consolidation

```yaml
personal_loan: POLICY_CHECK
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: PRODUCT_DEPENDENT
```

Do not mark every takeover category `CONFIRMED`.

---

# 13. SHRIRAM FINANCE

## Current

```yaml
starting_roi: 11.00
max_tenure: 60
```

Your old value:

```text
11.50%
```

should be removed.

## Eligibility

Do not use:

```yaml
min_cibil: 650
min_salary: 15000
```

as universal hard lender rejection rules.

Instead:

```yaml
published_cibil: PRODUCT_DEPENDENT
published_salary: PRODUCT_DEPENDENT
```

## Consolidation

Shriram supports debt-consolidation use cases.

But:

```yaml
personal_loan: CONFIRMED
multiple_personal_loans: PRODUCT_DEPENDENT
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: POLICY_CHECK
```

---

# 14. L&T FINANCE

## Current

```yaml
starting_roi: 10.50
max_tenure: 72
```

## Consolidation

Debt consolidation and personal-loan balance transfer are explicitly relevant use cases.

Use:

```yaml
personal_loan_balance_transfer: CONFIRMED
debt_consolidation: CONFIRMED
multiple_personal_loans: PRODUCT_DEPENDENT
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: PRODUCT_DEPENDENT
```

Your existing 60-month value should be updated to:

```text
72 months
```

---

# 15. ADITYA BIRLA FINANCE

```yaml
id: abfl
```

## Interest

Current public material indicates approximately:

```text
10.99%+
```

but the exact rate must remain product-dependent.

## Tenure

```yaml
max_tenure: PRODUCT_DEPENDENT
```

Do not hard-code 60 months as universal.

## CIBIL / salary

Your current:

```text
650 CIBIL
₹15,000 salary
```

should be treated as internal/reference values, not universal lender policy.

## Consolidation

Current database incorrectly treats:

```text
Credit Card = CONFIRMED
App Loan = CONFIRMED
```

as universal.

Change to:

```yaml
personal_loan: POLICY_CHECK
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: POLICY_CHECK
```

---

# 16. AXIS BANK

## Current published rate

Axis currently publishes:

```text
Starting rate: 9.99%
Maximum: 22%
```

It also publishes actual disbursal data for Apr–Jun 2026:

```text
Minimum actual ROI: 8.75%
Maximum actual ROI: 21.55%
Mean ROI: 13.07%
```

These are NOT the same as the advertised rate.

Therefore store separately:

```yaml
advertised_min_roi: 9.99

historical_actual_disbursal:
  period: "2026-Q2"
  min_roi: 8.75
  max_roi: 21.55
  mean_roi: 13.07
```

This distinction is extremely important.

## Tenure

Axis calculator currently exposes:

```text
12–84 months
```

Therefore do not blindly use 60 months if your chosen Axis product supports longer tenure.

Use:

```yaml
max_tenure: PRODUCT_DEPENDENT
```

until the product journey is selected.

## Credit

```yaml
preferred_cibil: 720+
```

but do not claim this is an absolute rejection cutoff.

---

# 17. POONAWALLA FINCORP

## Current status

This lender should remain **unverified** in your production engine until you obtain a current official product/rate card.

Do NOT use:

```yaml
headlineRate: 15
maxTenure: 60
min_cibil: 680
min_salary: 20000
```

as confirmed lender policy.

## Recommended

```yaml
interest_rate:
  status: POLICY_CHECK

tenure:
  status: POLICY_CHECK

minimum_salary:
  status: POLICY_CHECK

minimum_cibil:
  status: POLICY_CHECK

consolidation:
  status: POLICY_CHECK
```

---

# 18. HDB FINANCIAL SERVICES

The current database has:

```text
15%
60 months
650 CIBIL
₹15,000 salary
```

These should NOT be treated as verified generic HDBFS policy.

Use:

```yaml
roi: POLICY_CHECK
tenure: POLICY_CHECK
salary: POLICY_CHECK
cibil: POLICY_CHECK
```

## Consolidation

Replace:

```text
Credit Card = CONFIRMED
App Loan = CONFIRMED
```

with:

```yaml
personal_loan: POLICY_CHECK
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: POLICY_CHECK
```

---

# 19. PIRAMAL FINANCE

## Current verified product

For the salaried personal-loan product:

```text
ROI: 12.99% onwards
Loan amount: ₹25,000–₹5 lakh
Tenure: 3–60 months
```

Therefore:

```yaml
starting_roi: 12.99
min_tenure: 3
max_tenure: 60
```

Your existing 12.99% value is correct.

## Consolidation

Do not automatically classify credit-card or app-loan takeover as confirmed.

Use:

```yaml
personal_loan: CONFIRMED
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: POLICY_CHECK
```

---

# 20. CHOLA / CHOLAMANDALAM

Current generic values in the database:

```text
15%
60 months
650 CIBIL
₹15,000 salary
```

should not be treated as verified generic unsecured personal-loan policy.

Use:

```yaml
roi: POLICY_CHECK
tenure: POLICY_CHECK
cibil: POLICY_CHECK
salary: POLICY_CHECK
```

## Takeover

```yaml
personal_loan: POLICY_CHECK
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: POLICY_CHECK
```

---

# 21. MAHINDRA FINANCE

This lender needs special handling.

Current personal-loan product information indicates:

```text
Loan amount: ₹50,000–₹15 lakh
Tenure: 24–60 months
Customer/product restrictions apply
Debt consolidation is a stated use case
```

Therefore:

```yaml
min_tenure: 24
max_tenure: 60
```

## Important

Do NOT use:

```text
8%
```

as the generic personal-loan rate.

Mahindra Finance publishes broader interest-rate-policy ranges covering different personal/consumer loan categories and customer segments.

Those rates cannot safely be converted into one generic unsecured-personal-loan headline rate.

## Customer restriction

This is important for your engine:

```yaml
relationship_required: true
```

if using the customer-specific product.

## Consolidation

```yaml
debt_consolidation: CONFIRMED
personal_loan: PRODUCT_DEPENDENT
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: POLICY_CHECK
```

---

# 22. IIFL FINANCE

Current database:

```text
15%
60 months
650 CIBIL
₹15,000 salary
```

should not be considered verified generic policy.

IIFL has product-specific pricing and eligibility.

Therefore:

```yaml
roi: POLICY_CHECK
tenure: POLICY_CHECK
salary: POLICY_CHECK
cibil: POLICY_CHECK
```

## Consolidation

Balance transfer may be offered for eligible products, but don't automatically classify every liability type as eligible.

```yaml
personal_loan_balance_transfer: PRODUCT_DEPENDENT
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: POLICY_CHECK
```

---

# 23. FEDERAL BANK

## Current rate reference

Federal Bank publicly lists personal-loan rates from approximately:

```text
11.99% onwards
```

Therefore:

```yaml
starting_roi: 11.99
```

is reasonable as an advertised starting value.

## Tenure

Do not assume 60 months universally.

Use:

```yaml
max_tenure: PRODUCT_DEPENDENT
```

## Consolidation

```yaml
personal_loan: CONFIRMED
multiple_personal_loans: PRODUCT_DEPENDENT
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: PRODUCT_DEPENDENT
```

---

# 24. YES BANK

## Current

```yaml
starting_roi: 10.85
max_roi: 21
min_salary_reference: 25000
max_tenure: 72
```

The database's 72-month tenure is therefore appropriate.

## CIBIL

Do not use 700 as a universal hard cutoff.

Use:

```yaml
credit_expert_internal_floor: 700
preferred_cibil: 750
```

unless YES Bank provides a specific product-level minimum.

## Consolidation

```yaml
personal_loan: CONFIRMED
multiple_personal_loans: PRODUCT_DEPENDENT
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: PRODUCT_DEPENDENT
```

---

# 25. RBL BANK

RBL requires product-level modelling.

A verified pre-qualified personal-loan product has:

```text
Tenure: 12–36 months
```

Therefore:

```yaml
max_tenure: 36
```

for that specific product.

Do not represent it as a generic 60-month RBL personal loan.

## Relationship requirement

For the verified pre-qualified journey:

```yaml
existing_rbl_relationship: REQUIRED
```

may apply.

## Consolidation

```yaml
personal_loan_balance_transfer: PRODUCT_DEPENDENT
multiple_personal_loans: POLICY_CHECK
credit_card: POLICY_CHECK
digital_lender_loan: POLICY_CHECK
top_up: PRODUCT_DEPENDENT
```

---

# 26. MASTER TENURE RULES

Use these only at the product level.

| Lender                  | Recommended database tenure                        |
| ----------------------- | -------------------------------------------------- |
| HDFC                    | 60M                                                |
| ICICI                   | Product-dependent                                  |
| Kotak                   | 60M                                                |
| IDFC FIRST FIRSTmoney   | 9–60M                                              |
| IDFC FIRST Higher Limit | 12–84M                                             |
| IndusInd                | Product-dependent                                  |
| Bajaj Finance           | 12–108M                                            |
| Tata Capital            | 12–72M                                             |
| Shriram                 | 12–60M                                             |
| L&T Finance             | 12–72M                                             |
| Aditya Birla Finance    | Product-dependent                                  |
| Axis                    | Product-dependent; some journey supports up to 84M |
| Poonawalla              | Policy check                                       |
| HDBFS                   | Policy check                                       |
| Piramal                 | 3–60M                                              |
| Chola                   | Policy check                                       |
| Mahindra Finance        | 24–60M                                             |
| IIFL                    | Product-dependent                                  |
| Federal                 | Product-dependent                                  |
| YES Bank                | 12–72M                                             |
| RBL                     | 12–36M for verified pre-qualified product          |

---

# 27. DO NOT STORE ONLY `maxTenure`

Instead of:

```js
maxTenure: 60
```

use:

```js
tenure: {
  min_months: 12,
  max_months: 60,

  product: "personal_loan",

  source: "...",

  verified_date: "2026-09",

  confidence: "HIGH"
}
```

If multiple products exist:

```js
products: [
  {
    name: "FIRSTmoney",
    min_tenure: 9,
    max_tenure: 60
  },
  {
    name: "Higher Limit Personal Loan",
    min_tenure: 12,
    max_tenure: 84
  }
]
```

---

# 28. INTEREST-RATE DATA MODEL

Do NOT use:

```js
headlineRate: 10.99
```

as the only rate field.

Use:

```js
interest_rate: {
  advertised_min: 10.99,
  advertised_max: 29.99,

  actual_disbursal: {
    min: null,
    max: null,
    mean: null,
    period: null
  },

  rate_type: "REDUCING_BALANCE",

  source: null,

  verified_date: "2026-09",

  confidence: "HIGH"
}
```

This is especially important for Axis and ICICI because their published data distinguishes advertised rates from actual/historical disbursal rates.

---

# 29. CIBIL DATA MODEL

Never:

```js
min_cibil: 700
```

alone.

Use:

```js
cibil: {
  lender_published_min: null,
  lender_preferred: 750,

  credit_expert_internal_floor: 700,

  rate_benefit_threshold: 750,

  hard_rejection_threshold: null,

  source: null,

  confidence: "MEDIUM"
}
```

Example:

```js
IDFC: {
  lender_published_min: 710,
  credit_expert_internal_floor: 700,
  preferred: 750
}
```

---

# 30. SALARY DATA MODEL

Do not mix:

```text
lender minimum salary
```

with:

```text
Credit Expert India recommended salary
```

Use:

```js
salary: {
  lender_published_min: 25000,

  credit_expert_min: 30000,

  salary_type: "NET_MONTHLY",

  source: "...",

  confidence: "HIGH"
}
```

---

# 31. EMPLOYER POLICY

Your current system has:

```text
A+
A
B
C
```

This is fine as a **Credit Expert India internal employer model**.

It should NOT be described as:

> HDFC accepts A+ and A companies.

Instead:

```yaml
credit_expert_employer_policy:
  accepted_tiers:
    - A+
    - A

lender_published_employer_policy:
  status: POLICY_CHECK
```

---

# 32. EMPLOYER MASTER

Recommended:

```text
A+
A
B
C
D
UNKNOWN
```

But for lender matching:

```text
A+ = strongest
A  = strong
B  = acceptable
C  = secondary
D  = difficult
UNKNOWN = manual policy check
```

This is your scoring system.

It is not the bank's official classification unless you obtain a bank-specific employer list.

---

# 33. DEBT-CONSOLIDATION ELIGIBILITY MATRIX

The engine should classify each existing liability.

## Example

Customer has:

```text
HDFC Personal Loan       ₹4,00,000
ICICI Personal Loan      ₹2,00,000
Credit Card Outstanding  ₹1,00,000
KreditBee Loan             ₹80,000
```

The engine should produce:

```text
IDFC FIRST
HDFC PL      → ELIGIBLE_TO_CHECK
ICICI PL     → ELIGIBLE_TO_CHECK
Credit Card  → POLICY CHECK
KreditBee    → POLICY CHECK
```

NOT:

```text
All = YES
```

---

# 34. LIABILITY ENUM

Use:

```js
LIABILITY_TYPES = [

  "PERSONAL_LOAN",

  "PERSONAL_LOAN_BALANCE_TRANSFER",

  "MULTIPLE_PERSONAL_LOANS",

  "CREDIT_CARD_OUTSTANDING",

  "CREDIT_CARD_BALANCE_TRANSFER",

  "DIGITAL_LENDER_LOAN",

  "FINTECH_LOAN",

  "CONSUMER_DURABLE_LOAN",

  "TOP_UP"

]
```

---

# 35. TAKEOVER POLICY OBJECT

Recommended structure:

```js
takeover_policy: {

  PERSONAL_LOAN: {
    status: "CONFIRMED",
    minimum_vintage_months: null,
    maximum_vintage_months: null
  },

  MULTIPLE_PERSONAL_LOANS: {
    status: "POLICY_CHECK"
  },

  CREDIT_CARD_OUTSTANDING: {
    status: "POLICY_CHECK"
  },

  CREDIT_CARD_BALANCE_TRANSFER: {
    status: "POLICY_CHECK"
  },

  DIGITAL_LENDER_LOAN: {
    status: "POLICY_CHECK"
  },

  FINTECH_LOAN: {
    status: "POLICY_CHECK"
  },

  TOP_UP: {
    status: "PRODUCT_DEPENDENT"
  }

}
```

---

# 36. LOAN VINTAGE

This is missing from your current lender model and is important for consolidation.

Add:

```js
loan_vintage_policy: {

  minimum_months: null,

  maximum_months: null,

  status: "POLICY_CHECK"

}
```

Eventually populate it from lender policy.

---

# 37. CREDIT POLICY

Your current model only has:

```text
active_overdue
recent_bounce
```

This is not enough.

Add:

```js
credit_policy: {

  active_overdue: "POLICY_CHECK",

  recent_bounce: "POLICY_CHECK",

  recent_dpd: "POLICY_CHECK",

  dpd_30: "POLICY_CHECK",

  dpd_60: "POLICY_CHECK",

  dpd_90: "POLICY_CHECK",

  settled_account: "POLICY_CHECK",

  written_off_account: "POLICY_CHECK",

  suit_filed: "POLICY_CHECK",

  recent_enquiries: "POLICY_CHECK",

  high_credit_utilisation: "POLICY_CHECK",

  too_many_active_loans: "POLICY_CHECK"

}
```

---

# 38. EMPLOYMENT POLICY

Add:

```js
employment_policy: {

  employment_type: [
    "SALARIED"
  ],

  minimum_total_experience_months: null,

  minimum_current_employer_months: null,

  probation_allowed: "POLICY_CHECK",

  notice_period_allowed: "POLICY_CHECK",

  employer_category_required: "POLICY_CHECK",

  salary_account_required: "POLICY_CHECK"
}
```

---

# 39. AGE POLICY

Add to every lender:

```js
age_policy: {

  minimum_age: null,

  maximum_age_at_application: null,

  maximum_age_at_maturity: null,

  status: "POLICY_CHECK"

}
```

This matters because a 60-month loan for a 57-year-old is not equivalent to a 60-month loan for a 27-year-old.

---

# 40. CITY POLICY

Your current project already collects city.

Keep:

```js
city_policy: {

  supported_cities: [],

  excluded_locations: [],

  location_dependent_salary: false,

  status: "POLICY_CHECK"

}
```

This is especially important for banks whose minimum salary or employer eligibility varies by location.

---

# 41. FOIR POLICY

Do NOT invent a lender-specific FOIR.

Use:

```js
foir_policy: {

  published_max: null,

  credit_expert_internal_max: 50,

  status: "POLICY_CHECK"

}
```

Then calculate:

```text
FOIR =
(existing EMI + proposed EMI)
/
monthly net salary
× 100
```

---

# 42. CREDIT EXPERT INDIA ELIGIBILITY ENGINE

The lender engine should run in this order.

```text
1. Age
↓
2. Employment type
↓
3. Monthly net salary
↓
4. Employer classification
↓
5. Total employment vintage
↓
6. Current employer vintage
↓
7. CIBIL
↓
8. Existing overdue
↓
9. DPD history
↓
10. Existing loans
↓
11. Loan vintage
↓
12. Existing EMI
↓
13. FOIR
↓
14. Consolidation compatibility
↓
15. Lender maximum loan amount
↓
16. Tenure
↓
17. Estimated EMI
↓
18. Final lender score
```

---

# 43. CUSTOMER INPUTS REQUIRED

The customer should provide:

```text
Monthly Net Salary
CIBIL Score
City
Age
Employer Name
Employment Type
Total Work Experience
Current Employer Experience
Existing Loans
```

For every existing loan:

```text
Lender
Loan Type
Outstanding
EMI
Interest Rate
Original Loan Amount
Disbursement Date
Remaining Tenure
```

For credit cards:

```text
Card Issuer
Outstanding
Minimum Due
Total Limit
Utilisation
```

---

# 44. DISBURSEMENT / FIRST EMI RULE

For your existing Credit Expert India calculation:

```text
If disbursement date <= 20:
    first EMI = next month

If disbursement date >= 21:
    first EMI = month after next
```

This should be implemented as your internal calculation rule.

Do not present it as a universal lender policy unless the lender confirms it.

---

# 45. CONSOLIDATION AMOUNT

The engine should calculate:

```text
Total takeover amount
=
sum of eligible outstanding liabilities
```

Then:

```text
Potential new loan
=
eligible takeover amount
+
eligible top-up
```

Subject to:

```text
lender maximum loan amount
FOIR
salary multiple
CIBIL
employer
loan vintage
credit policy
```

---

# 46. TOP-UP

Top-up must not automatically mean:

```text
existing loan + extra money
```

The engine should separately store:

```js
top_up_policy: {

  available: true,

  status: "PRODUCT_DEPENDENT",

  minimum_vintage_months: null,

  minimum_repayment_history: null,

  maximum_topup: null
}
```

---

# 47. PREPAYMENT / FORECLOSURE

This is extremely important for debt consolidation.

A customer may save ₹5,000/month but still lose money because of:

* foreclosure fee
* processing fee
* GST
* stamp duty
* balance-transfer fee
* insurance
* other charges

Therefore every lender should have:

```js
foreclosure_policy: {

  allowed: true,

  charge_type: "PRODUCT_DEPENDENT",

  charge_value: null,

  part_payment_allowed: "POLICY_CHECK",

  source: null
}
```

For example, IDFC FIRST's current FIRSTmoney page explicitly states zero foreclosure charges. ICICI currently publishes a 3% foreclosure charge with nil after 24 EMIs for the cited product. These differences can materially change whether consolidation is worthwhile.

---

# 48. LOAN COMPARISON ENGINE

Never rank lenders only by ROI.

Use:

```text
Score =
CIBIL fit
+
Salary fit
+
Employer fit
+
FOIR fit
+
Consolidation fit
+
Tenure fit
+
Loan amount fit
+
Credit-history fit
+
Foreclosure economics
+
Processing cost
```

Example:

```text
Lender A
ROI = 10.5%
Processing = 4%
Foreclosure = 5%

Lender B
ROI = 11.5%
Processing = 1%
Foreclosure = 0%

```

Lender B could be cheaper depending on remaining tenure.

---

# 49. LENDER CONFIDENCE SCORE

Add:

```js
confidence: {

  roi: "HIGH",

  tenure: "HIGH",

  salary: "HIGH",

  cibil: "MEDIUM",

  employer_policy: "LOW",

  consolidation: "MEDIUM",

  credit_policy: "LOW"
}
```

Recommended levels:

```text
HIGH
MEDIUM
LOW
UNKNOWN
```

---

# 50. SOURCE METADATA

Every lender field should eventually contain:

```js
{
  value: 9.99,

  source: "IDFC FIRST Bank",

  source_url: "...",

  source_type: "OFFICIAL_LENDER",

  verified_date: "2026-09-08",

  confidence: "HIGH"
}
```

This allows the admin to see exactly where every number came from.

---

# 51. DATABASE STRUCTURE

Recommended production structure:

```text
LENDERS
│
├── lender_identity
│
├── products
│   ├── personal_loan
│   ├── balance_transfer
│   ├── debt_consolidation
│   └── top_up
│
├── pricing
│   ├── advertised_rate
│   ├── actual_disbursal_rate
│   ├── processing_fee
│   └── foreclosure
│
├── tenure
│
├── eligibility
│   ├── age
│   ├── salary
│   ├── cibil
│   ├── employment
│   └── employer
│
├── consolidation
│
├── credit_policy
│
├── employment_policy
│
├── city_policy
│
└── source_metadata
```

---

# 52. IMPORTANT: YOUR CURRENT FILE VS PRODUCTION VERSION

Your current uploaded file is a useful **initial lender list**, but it currently compresses complex lender policy into fields such as:

```js
headlineRate
maxTenure
min_cibil
min_salary
eligible_employer_tiers
takeover_policy
credit_policy
```

For example, HDFC is currently represented with 10.50%, 60 months, 720 CIBIL and ₹30,000 salary, while IDFC is represented with 9.99%, 60 months, 700 CIBIL and ₹25,000 salary.
Those fields are fine for a prototype, but **not sufficient for production underwriting**.

---

# 53. RECOMMENDED PRODUCTION LENDER OBJECT

```js
{
  id: "idfc",

  name: "IDFC FIRST Bank",

  type: "PRIVATE_BANK",

  products: {

    firstmoney: {

      product_status: "ACTIVE",

      loan_type: "UNSECURED_PERSONAL_LOAN",

      loan_amount: {
        min: 50000,
        max: 1500000
      },

      interest_rate: {
        advertised_min: 9.99,
        advertised_max: null,
        rate_type: "REDUCING_BALANCE"
      },

      tenure: {
        min_months: 9,
        max_months: 60
      },

      eligibility: {

        employment_type: [
          "SALARIED",
          "SELF_EMPLOYED"
        ],

        min_age: 21,

        max_age: 60,

        lender_published_cibil: 710
      },

      consolidation: {

        debt_consolidation: "CONFIRMED",

        personal_loan_balance_transfer: "CONFIRMED",

        multiple_personal_loans: "POLICY_CHECK",

        credit_card: "POLICY_CHECK",

        digital_lender_loan: "POLICY_CHECK",

        fintech_loan: "POLICY_CHECK",

        top_up: "PRODUCT_DEPENDENT"
      },

      foreclosure: {

        status: "CONFIRMED",

        charge: 0
      },

      source: {

        source_type: "OFFICIAL_LENDER",

        verified_date: "2026-09"
      }
    }
  }
}
```

---

# 54. FINAL POLICY PRINCIPLE

Credit Expert India should NEVER tell a customer:

> "You are guaranteed to get ₹X from Bank Y."

Instead show:

### Strong Match

```text
Likely eligible
```

### Good Match

```text
Potentially eligible
```

### Conditional

```text
Requires lender policy verification
```

### Weak Match

```text
Profile does not currently fit our screening criteria
```

### Not eligible

Only use this when a genuine hard rule is violated.

---

# 55. CUSTOMER-FACING RESULT

Example:

```text
IDFC FIRST Bank

Match Score
92/100

Potential Loan
₹8.5 lakh

Estimated ROI
From 9.99% p.a.

Possible Tenure
9–60 months

Your CIBIL
758

Required/reference CIBIL
710+

Debt Consolidation
Supported

Existing Personal Loans
Potentially eligible for balance transfer

Credit Card
Requires policy verification

Digital Loan
Requires policy verification

Status
Strong Match
```

The customer should also see:

```text
⚠ Final approval, interest rate and loan amount
are subject to lender verification and internal credit policy.
```

---

# 56. FINAL STATUS OF THE 20-LENDER DATABASE

## 🟢 Can be used as a strong starting point

```text
HDFC Bank
ICICI Bank
Kotak Mahindra Bank
IDFC FIRST Bank
IndusInd Bank
Bajaj Finance
Tata Capital
Shriram Finance
L&T Finance
Axis Bank
Piramal Finance
Mahindra Finance
YES Bank
```

## 🟡 Keep but make product/policy dependent

```text
Aditya Birla Finance
Federal Bank
IIFL Finance
RBL Bank
```

## 🔴 Do not hard-code unverified numbers yet

```text
Poonawalla Fincorp
HDB Financial Services
Chola
```

---

# 57. IMMEDIATE CHANGES TO YOUR EXISTING FILE

```text
HDFC
10.50 → 10.90 published reference
₹30,000 → ₹25,000 published minimum
Keep 60M
Do not hard-code 720 as lender rejection rule

ICICI
10.80 → 9.99 current published starting rate
72M → PRODUCT_DEPENDENT
700 → reference, not hard rejection

Kotak
Keep 10.99
Keep 60M
Convert takeover categories to product-dependent

IDFC
Keep 9.99
Keep 60M for FIRSTmoney
Add separate 84M higher-limit product
700 → 710 published FIRSTmoney reference

IndusInd
Keep 10.49
Keep product-specific 60M
Add 730+ preferred
Add employment vintage

Bajaj
Keep 10.00
Keep 108M
650 is the published reference
Do not mark all takeover types confirmed

Tata
Keep 10.99
Keep 72M
Do not mark all takeover types confirmed

Shriram
Keep 11.00
Keep 60M
Do not mark all takeover types confirmed

L&T
Keep 10.50
Keep 72M
Debt consolidation = confirmed
BT = confirmed

Aditya Birla
Keep ~10.99 as reference
Make tenure product-dependent
Remove confirmed CC/App Loan takeover

Axis
Keep 9.99 advertised rate
Add actual disbursal rate separately
Tenure product-dependent
Do not use 700 as hard cutoff

Poonawalla
Remove hard-coded ROI
Remove hard-coded tenure
Policy check

HDBFS
Remove hard-coded ROI
Policy check

Piramal
Keep 12.99
Keep 60M
3M minimum where applicable
Remove blanket takeover confirmations

Chola
Remove hard-coded generic ROI
Remove blanket takeover confirmations

Mahindra
Do not use 8%/12.75% as generic PL ROI
Use 24–60M for relevant personal-loan product
Relationship/product restriction

IIFL
Remove generic 15% until product verified
Product-dependent tenure

Federal
Keep 11.99 reference
Product-dependent tenure

YES Bank
Keep 10.85
Keep 72M
Product-dependent consolidation

RBL
Keep 36M only for verified pre-qualified product
Do not model as generic 60M PL
Relationship/product dependent
```

---

# 58. MOST IMPORTANT NEXT DEVELOPMENT STEP

Do **not** keep expanding the current object with more random fields.

Build these four collections/tables:

```text
1. LENDER_MASTER
2. LENDER_PRODUCTS
3. LENDER_POLICIES
4. LENDER_SOURCES
```

Then:

```text
CUSTOMER
    ↓
CREDIT PROFILE
    ↓
EMPLOYER PROFILE
    ↓
EXISTING LIABILITIES
    ↓
FOIR
    ↓
LENDER PRODUCT FILTER
    ↓
CONSOLIDATION COMPATIBILITY
    ↓
LENDER SCORE
    ↓
RANKED OFFERS
```

This structure will let Credit Expert India eventually support **hundreds or thousands of lender products without rewriting the eligibility engine**.

---

# 59. DATA QUALITY RULE

Every lender field must have:

```text
VALUE
SOURCE
SOURCE TYPE
VERIFIED DATE
CONFIDENCE
PRODUCT
STATUS
```

Example:

```text
ROI
├── 9.99%
├── Official IDFC FIRST
├── Verified September 2026
├── Product: FIRSTmoney
├── Confidence: HIGH
└── Status: CONFIRMED
```

Never store unexplained numbers such as:

```text
10.75
650
15000
60
```

without knowing:

```text
WHY?
FOR WHICH PRODUCT?
FROM WHICH SOURCE?
WHEN VERIFIED?
IS IT A HARD RULE OR JUST A REFERENCE?
```

That distinction is what will make the Credit Expert India lender engine reliable rather than just a list of loan rates.
