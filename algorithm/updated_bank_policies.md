# Credit Expert India — Debt Consolidation & Balance Transfer Eligibility

## 1. Purpose

The Eligibility Engine should identify whether a salaried customer can consolidate existing liabilities into a new loan.

The system should not treat all liabilities as one generic Balance Transfer (BT) category.

Instead, liabilities should be grouped into **three consolidation buckets**:

1. **App Loans + Credit Cards + OD + Multiple Personal Loans**
2. **Personal Loans + Credit Cards**
3. **OD + Personal Loans**

The engine should identify the customer's liability combination and recommend lenders whose products support that combination.

> **Important:** ROI values in this document represent the configured **starting/minimum ROI used for comparison**, not a guaranteed sanctioned rate. Actual ROI is subject to lender underwriting, customer profile, age (max 56), income, company, FOIR, and other lender-specific policies.

---

# 2. Liability Types

The eligibility system should support the following liability types:

```text
PERSONAL_LOAN
APP_LOAN
CREDIT_CARD
OVERDRAFT
```

Each existing liability should contain:

```text
loan_id
lender_name
loan_type
outstanding_amount
emi
interest_rate
tenure
remaining_tenure
disbursed_date
months_on_book
```

For credit cards:

```text
loan_type = CREDIT_CARD
outstanding_amount
minimum_due
emi_if_converted_to_emi
credit_limit
utilization
```

For OD:

```text
loan_type = OVERDRAFT
sanctioned_limit
outstanding_amount
monthly_interest_or_emi
```

---

# 3. Consolidation Buckets

## Bucket 1 — Mixed Debt Consolidation

### Supported liabilities

This bucket is designed for customers having combinations of:

* App Loans
* Credit Cards
* Overdraft
* Multiple Personal Loans

The purpose is to merge eligible outstanding liabilities into **one new loan / one EMI**.

### Lenders

| Lender         | Supported Combination            | Starting ROI |
| -------------- | -------------------------------- | -----------: |
| [Primary Bank] | App Loan + CC + OD + Multiple PL |       12.00% |

### Priority

```text
1. [Primary Bank]
```

The engine should rank these lenders primarily by:

1. Eligibility
2. Lowest configured ROI
3. Highest eligible loan amount
4. Suitable tenure
5. Lowest expected EMI
6. Lender-specific policy

### Example

Customer:

```text
Personal Loan #1     ₹2,00,000
Personal Loan #2     ₹1,50,000
Credit Card          ₹1,00,000
App Loan #1          ₹75,000
OD                   ₹1,25,000
--------------------------------
Total                ₹6,50,000
```

The system should identify:

```text
Debt Pattern:
MIXED_HIGH_DEBT

Eligible Bucket:
BUCKET_1

Potential Lenders:
Axis Finance
Poonawalla Fincorp
Fullerton
```

---

# 4. Bucket 2 — Personal Loan + Credit Card Consolidation

## Supported liabilities

This bucket should be triggered when the customer has:

* One Personal Loan + Credit Card
* Multiple Personal Loans + Credit Card
* Multiple Personal Loans + multiple Credit Cards

The objective is to consolidate eligible PL and CC outstanding into one loan.

### Lenders

| Lender         | Supported Combination          | Starting ROI |
| -------------- | ------------------------------ | -----------: |
| [Primary Bank] | PL + Credit Card               |        9.99% |

### Priority

```text
1. [Primary Bank]
```

### Important

Tata Capital publicly states that its balance-transfer facility can consolidate multiple personal loans into a single EMI and currently publishes a starting BT rate of 10.99%; its stated BT tenure can extend up to 7 years, subject to eligibility.

Therefore, lender-specific tenure and eligibility should be stored separately instead of assuming every lender offers the same tenure.

---

# 5. Bucket 3 — OD + Personal Loan Consolidation

## Supported liabilities

This bucket is intended for:

* OD + Personal Loan
* OD + Multiple Personal Loans

### Lenders

| Lender         | Supported Combination | Starting ROI |
| -------------- | --------------------- | -----------: |
| [Primary Bank] | OD + PL               |        9.99% |

### Priority

```text
[Primary Bank]
```

---

# 6. Liability Classification Engine

The system should first count the customer's liability types.

```javascript
const hasPL = liabilities.some(x => x.type === "PERSONAL_LOAN");

const hasCC = liabilities.some(x => x.type === "CREDIT_CARD");

const hasOD = liabilities.some(x => x.type === "OVERDRAFT");

const hasAppLoan = liabilities.some(x => x.type === "APP_LOAN");

const plCount = liabilities.filter(
    x => x.type === "PERSONAL_LOAN"
).length;
```

---

# 7. Consolidation Matching Logic

## Rule 1 — Mixed Debt

If the customer has any combination involving:

```text
APP_LOAN
+
CREDIT_CARD
+
OD
+
MULTIPLE_PL
```

then evaluate:

```text
BUCKET_1
```

Example:

```text
PL + CC + App Loan
```

→ Bucket 1

```text
PL + OD + App Loan
```

→ Bucket 1

```text
PL + CC + OD
```

→ Bucket 1

```text
Multiple PL + CC + App Loan + OD
```

→ Bucket 1

---

# 8. Rule 2 — PL + Credit Card

If:

```text
hasPL = true
AND
hasCC = true
AND
hasOD = false
AND
hasAppLoan = false
```

then evaluate:

```text
BUCKET_2
```

Example:

```text
PL #1
PL #2
Credit Card
```

→ Bucket 2

---

# 9. Rule 3 — OD + PL

If:

```text
hasOD = true
AND
hasPL = true
AND
hasAppLoan = false
AND
hasCC = false
```

then evaluate:

```text
BUCKET_3
```

Example:

```text
OD
PL #1
PL #2
```

→ Bucket 3

---

# 10. Rule Priority

If a customer qualifies for multiple patterns, use the **most comprehensive liability bucket first**.

Priority:

```text
BUCKET_1
   ↓
BUCKET_2
   ↓
BUCKET_3
```

Example:

```text
Customer:
PL + CC + OD
```

This should **not** be classified only as:

```text
PL + CC
```

It should be classified as:

```text
MIXED DEBT
→ BUCKET_1
```

because Bucket 1 is designed for broader consolidation.

---

# 11. Multiple Personal Loans

Multiple PLs should not automatically create a separate bucket.

For example:

```text
PL #1
PL #2
PL #3
```

should be classified according to what else the customer has.

### Multiple PL only

```text
PL + PL + PL
```

→ Personal Loan BT / Multiple PL Consolidation

Recommended lenders can include:

```text
[Primary Bank]
```

subject to their current product policies.

### Multiple PL + Credit Card

```text
PL + PL + CC
```

→ Bucket 2

### Multiple PL + OD

```text
PL + PL + OD
```

→ Bucket 3

### Multiple PL + CC + OD/App Loan

```text
PL + PL + CC + OD
```

or

```text
PL + PL + CC + App Loan
```

→ Bucket 1

---

# 12. ROI Configuration

ROI should be stored as structured lender data.

Example:

```javascript
const consolidationLenders = {

    mixed_debt: [
        {
            lender: "[Primary Bank]",
            roi_from: 12.00
        }
    ],

    pl_credit_card: [
        {
            lender: "[Primary Bank]",
            roi_from: 9.99
        }
    ],

    od_pl: [
        {
            lender: "[Primary Bank]",
            roi_from: 9.99
        }
    ]
};
```

---

# 13. Never Display ROI as Guaranteed

The UI should display:

```text
Starting from 9.99% p.a.
```

NOT:

```text
You will get 9.99%
```

The system should use:

```text
ROI_FROM
```

instead of:

```text
FINAL_ROI
```

because final pricing depends on underwriting.

---

# 14. Consolidated Loan Amount

The maximum potential consolidation requirement should initially be calculated as:

```text
Total Eligible Outstanding
=
Σ eligible loan outstanding
+
eligible credit card outstanding
+
eligible OD outstanding
```

Example:

```text
PL 1       ₹2,00,000
PL 2       ₹1,50,000
CC         ₹1,00,000
OD         ₹1,25,000
---------------------
Total      ₹5,75,000
```

Potential consolidation amount:

```text
₹5,75,000
```

However, final eligible amount must be capped by lender-specific:

* Maximum loan amount
* FOIR
* Net salary
* Maximum age (56 years)
* Company (Employer category)
* Existing obligations
* Internal credit policy

---

# 15. EMI Calculation

For each lender, calculate an indicative EMI:

```text
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
```

Where:

```text
P = Consolidation amount
r = Monthly interest rate
n = Number of months
```

Example:

```text
Loan Amount = ₹5,75,000
ROI = 9.99%
Tenure = 60 months
```

Calculate the indicative EMI and display it as:

```text
Estimated EMI
```

not:

```text
Approved EMI
```

---

# 16. Savings Calculation

The system should compare:

### Existing EMI

```text
Existing EMI
=
PL EMIs
+
CC EMI/minimum repayment
+
OD obligation
+
App Loan EMIs
```

### New EMI

```text
New Consolidated EMI
```

### Monthly Savings

```text
Monthly Savings
=
Existing Monthly Debt Outflow
-
New Consolidated EMI
```

Example:

```text
Existing EMI             ₹38,000
New Consolidated EMI     ₹25,000
---------------------------------
Potential monthly saving ₹13,000
```

---

# 17. Consolidation Recommendation

The recommendation engine should rank lenders using:

```text
1. Product compatibility
2. Customer eligibility
3. CIBIL requirement
4. FOIR eligibility
5. Minimum salary
6. Loan vintage
7. Maximum loan amount
8. Starting ROI
9. Available tenure
10. Estimated EMI
11. Processing fee
12. Foreclosure/prepayment costs
```

ROI should **not** be the only ranking factor.

A lender offering 9.99% but rejecting the customer's profile is less useful than a lender offering 12% that the customer is actually eligible for.

---

# 18. Frontend Display

The result should look approximately like:

```text
DEBT CONSOLIDATION OPTIONS

Your existing liabilities
────────────────────────────

Personal Loans        ₹3,50,000
Credit Cards          ₹1,00,000
App Loans               ₹75,000
OD                    ₹1,25,000
────────────────────────────
Total Debt            ₹6,50,000


Recommended Route
────────────────────────────

MIXED DEBT CONSOLIDATION

Your profile contains multiple types of
high-cost liabilities.

You may be eligible to consolidate them
into one loan and one EMI.

Potential lenders:

┌─────────────────────────────────┐
│ Axis Finance                    │
│ Starting from 12.00% p.a.      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Poonawalla Fincorp              │
│ Starting from 12.00% p.a.      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Fullerton                       │
│ Starting from 13.00% p.a.      │
└─────────────────────────────────┘
```

---

# 19. If Customer Has PL + CC Only

Display:

```text
PERSONAL LOAN + CREDIT CARD
CONSOLIDATION

Potential lenders:

Axis Bank              From 9.99%
Chola                   From 10.99%
Tata Capital            From 10.99%
Aditya Birla Finance    From 10.99%
Piramal Finance         From 10.99%
```

---

# 20. If Customer Has OD + PL Only

Display:

```text
OD + PERSONAL LOAN
CONSOLIDATION

Potential lenders:

L&T Finance             From 9.99%
Kotak Bank              Rate subject to eligibility
IndusInd Bank           Rate subject to eligibility
```

---

# 21. If No Consolidation Match Exists

The system should not falsely recommend BT.

Display:

```text
No matching consolidation product
was identified from the currently
configured lender policies.

You may still qualify for a standard
personal loan depending on your profile.
```

---

# 22. Data Architecture

Recommended structure:

```javascript
{
    lender: "Axis Bank",

    consolidation_products: [

        {
            product_type: "PL_CC_BT",

            eligible_liabilities: [
                "PERSONAL_LOAN",
                "CREDIT_CARD"
            ],

            roi_from: 9.99,

            tenure_min: null,
            tenure_max: null,

            min_salary: null,
            min_cibil: null,

            max_loan_amount: null,

            active: true
        }

    ]
}
```

This allows the lender policies to be updated without changing the eligibility engine itself.

---

# 23. Policy Separation

The application should separate:

### Product rules

```text
What liabilities can be consolidated?
```

from:

### Credit rules

```text
Who is eligible?
```

from:

### Pricing rules

```text
What ROI can be offered?
```

from:

### Affordability rules

```text
How much EMI can the customer afford?
```

This architecture is important because lender policies will change over time.

---

# 24. Final Eligibility Flow

```text
STEP 1
Collect customer information
        ↓
STEP 2
Collect all existing liabilities
        ↓
STEP 3
Classify each liability
        ↓
STEP 4
Calculate total outstanding
        ↓
STEP 5
Calculate existing monthly obligation
        ↓
STEP 6
Identify liability pattern
        ↓
STEP 7
Match against consolidation products
        ↓
STEP 8
Apply salary / FOIR rules
        ↓
STEP 9
Apply CIBIL rules
        ↓
STEP 10
Apply lender-specific rules
        ↓
STEP 11
Calculate eligible amount
        ↓
STEP 12
Calculate indicative EMI
        ↓
STEP 13
Rank lenders
        ↓
STEP 14
Display consolidation options
```

---

# 25. Current Lender Matrix

## Mixed Debt

| Lender             | App Loan | CC | OD | Multiple PL | ROI From |
| ------------------ | -------: | -: | -: | ----------: | -------: |
| Axis Finance       |        ✅ |  ✅ |  ✅ |           ✅ |   12.00% |
| Poonawalla Fincorp |        ✅ |  ✅ |  ✅ |           ✅ |   12.00% |
| Fullerton          |        ✅ |  ✅ |  ✅ |           ✅ |   13.00% |

---

## PL + Credit Card

| Lender               | PL | CC | Multiple PL | ROI From |
| -------------------- | -: | -: | ----------: | -------: |
| Axis Bank            |  ✅ |  ✅ |          ✅* |    9.99% |
| Chola                |  ✅ |  ✅ |          ✅* |   10.99% |
| Tata Capital         |  ✅ | ✅* |           ✅ |   10.99% |
| Aditya Birla Finance |  ✅ |  ✅ |          ✅* |   10.99% |
| Piramal Finance      |  ✅ |  ✅ |          ✅* |   10.99% |

`*` = Must be verified against the lender's current product-specific policy before being treated as a hard eligibility rule.

---

## OD + PL

| Lender        | OD | PL | Multiple PL | ROI From |
| ------------- | -: | -: | ----------: | -------: |
| Kotak Bank    | ✅* |  ✅ |          ✅* |      TBD |
| IndusInd Bank | ✅* |  ✅ |          ✅* |      TBD |
| L&T Finance   | ✅* |  ✅ |          ✅* |    9.99% |

`*` = Product/policy verification required before production use.

---

# 26. Important Production Rule

**Do not permanently hard-code lender policies into frontend code.**

Use a lender-policy database/configuration layer.

Example:

```text
LENDER
   ↓
PRODUCT
   ↓
ELIGIBLE LIABILITY TYPES
   ↓
MIN ROI
   ↓
MAX ROI
   ↓
MIN SALARY
   ↓
MIN CIBIL
   ↓
FOIR
   ↓
TENURE
   ↓
MIN/MAX LOAN
   ↓
VINTAGE
   ↓
EMPLOYER POLICY
   ↓
GEOGRAPHY
   ↓
ACTIVE/INACTIVE
```

This will allow Credit Expert India to update lender policies without deploying a new frontend version.

---

# 27. Important Disclaimer

All displayed ROI, eligibility, tenure, loan amount and consolidation results should be labelled as:

> **Indicative eligibility only. Final approval, interest rate, loan amount and tenure are subject to the lender's internal credit policy and underwriting.**

For example, Tata Capital currently publishes a BT rate range of 10.99%–29.99%, showing why the application's `10.99%` value should be treated as a **starting rate**, not the customer's guaranteed rate.

---

# 28. Configuration Summary

```text
BUCKET 1
Mixed Debt
────────────────────────
App Loan
Credit Card
OD
Multiple PL

Axis Finance          12%
Poonawalla            12%
Fullerton             13%


BUCKET 2
PL + Credit Card
────────────────────────
Personal Loan
Credit Card
Multiple PL

Axis Bank              9.99%
Chola                  10.99%
Tata Capital           10.99%
Aditya Birla Finance   10.99%
Piramal Finance        10.99%


BUCKET 3
OD + PL
────────────────────────
OD
Personal Loan
Multiple PL

Kotak Bank              TBD
IndusInd Bank           TBD
L&T Finance             9.99%
```

# 29. Core Objective

The Eligibility Engine should answer four questions:

```text
1. WHAT does the customer currently owe?
                ↓
2. CAN these liabilities be consolidated?
                ↓
3. WHICH lenders can potentially consolidate them?
                ↓
4. WHICH option gives the customer the
   most suitable repayment outcome?
```

The system should therefore optimize for **eligible consolidation**, not simply the lowest advertised ROI.
