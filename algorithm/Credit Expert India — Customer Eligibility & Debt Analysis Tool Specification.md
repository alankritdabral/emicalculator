# Credit Expert India — Customer Eligibility & Debt Analysis Tool

## 1. Project Objective

Build a customer-facing **Eligibility & Debt Analysis Tool** for Credit Expert India.

The tool should allow an Indian customer to:

1. Enter their monthly net salary.
2. Calculate an estimated maximum EMI they can comfortably pay per month.
3. Add all existing loans/credit obligations.
4. Automatically calculate:
   - Current EMI burden
   - EMI eligibility
   - Number of EMIs paid
   - Number of EMIs remaining
   - Approximate outstanding principal
   - Remaining repayment burden
5. Identify which loans may be eligible for:
   - Balance Transfer
   - Loan-to-Loan transfer
   - Debt consolidation
   - Loan merging
6. Match eligible loans against a configurable database of:
   - Banks
   - NBFCs
   - Loan types supported
   - Transfer rules
   - Consolidation/merge rules
   - Minimum available ROI
7. Calculate potential:
   - New EMI
   - EMI reduction
   - Monthly savings
   - Annual savings
   - Interest savings
8. Clearly distinguish:
   - Loans that can potentially be transferred
   - Loans that generally cannot be transferred
   - Loans that may be consolidated into another loan
9. Allow the customer to keep adding unlimited loans.

The overall experience should communicate:

> **Understand your debt → See your eligibility → Find possible ways to reduce your EMI.**

The existing Credit Expert India brand is centered around **REDUCE. MANAGE. CLEAR.**, so this tool should reinforce that positioning.

---

# 2. Important Principle

This is an **eligibility estimator and financial analysis tool**.

It must NOT claim:

- Guaranteed approval
- Guaranteed balance transfer
- Guaranteed interest rate
- Guaranteed savings
- Guaranteed EMI reduction

Every calculated lender scenario should use language such as:

> Estimated

> Potential

> Indicative

> Subject to lender eligibility and approval.

This follows the existing Credit Expert India requirement that calculator outputs must be presented as estimates rather than guarantees.

---

# 3. Customer Journey

The complete journey should be:

```text
STEP 1
Net Monthly Salary
        ↓
STEP 2
Calculate Estimated EMI Capacity
        ↓
STEP 3
Add Existing Loans
        ↓
STEP 4
Calculate Current EMI Burden
        ↓
STEP 5
Calculate EMIs Paid / Remaining
        ↓
STEP 6
Calculate Estimated Outstanding
        ↓
STEP 7
Identify Transferable Loans
        ↓
STEP 8
Match Banks / NBFCs
        ↓
STEP 9
Calculate Possible New EMI
        ↓
STEP 10
Calculate Potential Savings
        ↓
STEP 11
Show Recommended Options
        ↓
STEP 12
Talk to Credit Expert
```

---

# 4. Page Heading

## Primary heading

> **See How Much EMI You Can Manage**

## Supporting text

> Enter your monthly income and existing loans to understand your current EMI burden and explore potential ways to reduce it.

Alternative:

> **Understand Your EMI. Find Your Options.**

CTA:

> **Analyse My Loans**

---

# 5. Step 1 — Net Salary

The first input should be:

### Monthly Net Salary

```text
₹ __________________
```

Label:

> **Monthly Net Salary**

Helper text:

> Enter the amount you receive in your bank account every month after deductions.

Example:

```text
₹50,000
```

---

# 6. EMI Eligibility Calculation

After salary is entered, calculate an estimated EMI capacity.

The exact eligibility percentage should be configurable from the admin/backend.

Example configuration:

```javascript
emiEligibilityRatio = 0.50
```

Example:

```text
Net Salary = ₹50,000

Estimated EMI Capacity
= ₹50,000 × 50%

= ₹25,000/month
```

Display:

```text
YOUR ESTIMATED EMI CAPACITY

₹25,000 / month
```

Supporting text:

> This is an estimate based on the income entered. Actual lender eligibility may vary.

---

# 7. Configurable EMI Eligibility

Do NOT hard-code the EMI percentage permanently.

Create a configuration:

```text
Minimum EMI Ratio
Maximum EMI Ratio
Default EMI Ratio
```

Example:

```json
{
  "defaultEmiRatio": 0.50,
  "minimumEmiRatio": 0.40,
  "maximumEmiRatio": 0.60
}
```

This allows the business/admin to change the calculation later.

---

# 8. Existing Loan Section

After salary:

## Heading

> **Now tell us about your existing loans**

Supporting text:

> Add your loans one by one. We'll calculate your current EMI burden and check which loans may have potential transfer or consolidation options.

---

# 9. Loan Entry Component

Every loan should be represented as a row/card.

The customer should be able to click:

> **+ Add Another Loan**

There should be no fixed maximum number of loans.

---

# 10. Loan Fields

Each loan must contain:

```text
Bank / NBFC
Loan Type
Disbursed Date
Original Loan Amount
Current Outstanding
Rate of Interest
EMI
Loan Tenure
```

Some fields can be optional depending on the calculation strategy.

---

# 11. Bank / NBFC Selection

Create a searchable dropdown.

Example:

```text
Search Bank / NBFC
[ HDFC ]
```

Results:

```text
HDFC Bank
ICICI Bank
Axis Bank
Kotak Mahindra Bank
Bajaj Finance
Tata Capital
Aditya Birla Finance
```

The database will eventually contain the user's supplied lender list.

---

# 12. Bank Search Behaviour

The bank selector must support:

### Search existing lender

```text
Type:
HDFC

Results:
HDFC Bank
```

### If lender exists

Select from database.

### If lender does not exist

Show:

> **Can't find your bank? Enter it manually**

Then allow:

```text
Custom Bank / NBFC Name
____________________
```

Store:

```javascript
isCustomLender: true
```

Do NOT prevent the customer from continuing because a lender is missing.

---

# 13. Loan Type

Create a dropdown:

```text
Personal Loan
Overdraft
App Loan
Credit Card
Car Loan / Auto Loan
Home Loan
Loan Against Property
Gold Loan
Consumer Loan
Business Loan
Other
```

The system must allow the admin to add more loan types later.

---

# 14. Loan Classification

Create two major classifications.

## Category A — Generally Non-Transferable

These should be classified as:

```text
FIXED / NON-BALANCE-TRANSFER
```

Initial business rules supplied:

```text
Car Loan / Auto Loan
Home Loan
Loan Against Property
Gold Loan
Consumer Loan
```

For these loans:

```text
Balance Transfer:
Not available by default
```

The existing EMI should be treated as fixed for the transfer analysis.

Important:

The AI agent must NOT interpret this as an absolute industry-wide rule.

Instead use:

```javascript
balanceTransferAllowed = false
```

unless the lender database explicitly overrides the rule.

---

# 15. Category B — Potentially Transferable

Initial categories:

```text
Personal Loan
Overdraft
App Loan
Credit Card
```

These should be classified:

```text
TRANSFER / CONSOLIDATION ELIGIBLE
```

subject to lender-specific rules.

For example:

```text
Personal Loan
→ Personal Loan BT

Personal Loan
→ Consolidation Loan

Overdraft
→ Personal Loan / Consolidation

App Loan
→ Personal Loan / Consolidation

Credit Card
→ Personal Loan / Consolidation
```

These mappings must NOT be hard-coded permanently.

They should come from the lender database.

---

# 16. Important Transfer Engine

The system should use a matrix.

Example:

```text
SOURCE LOAN
       ↓
Personal Loan
       ↓
Check lender database
       ↓
Which lenders accept it?
       ↓
Which destination loan types?
       ↓
Minimum ROI?
       ↓
Maximum tenure?
       ↓
Eligible?
```

---

# 17. Lender Rules Database

Create a structure similar to:

```javascript
{
  lenderName: "Example Bank",

  loanProducts: [
    {
      productName: "Personal Loan Balance Transfer",

      accepts: [
        "Personal Loan",
        "Credit Card",
        "App Loan"
      ],

      canMerge: [
        "Personal Loan",
        "Credit Card",
        "App Loan",
        "Overdraft"
      ],

      minimumROI: 10.99,

      maximumTenureMonths: 60,

      minimumLoanAmount: 100000,

      maximumLoanAmount: 5000000
    }
  ]
}
```

The actual lender data will be populated from the user's supplied report/database.

---

# 18. Source → Destination Matrix

The system should ultimately be capable of representing:

| Existing Loan | Destination | Possible? |
|---|---|---|
| Personal Loan | Personal Loan BT | Configurable |
| Personal Loan | Consolidation Loan | Configurable |
| Overdraft | Personal Loan | Configurable |
| Overdraft | Consolidation Loan | Configurable |
| App Loan | Personal Loan | Configurable |
| App Loan | Consolidation Loan | Configurable |
| Credit Card | Personal Loan | Configurable |
| Credit Card | Consolidation Loan | Configurable |
| Car Loan | Personal Loan | Usually No |
| Home Loan | Personal Loan | Usually No |
| LAP | Personal Loan | Usually No |
| Gold Loan | Personal Loan | Usually No |
| Consumer Loan | Personal Loan | Usually No |

The actual result must come from lender configuration.

---

# 19. Disbursed Date

The user enters:

```text
Disbursed Date
DD/MM/YYYY
```

Example:

```text
15/06/2025
```

---

# 20. First EMI Rule

Implement this exact initial business rule:

### If disbursed date is on or before the 20th:

```text
First EMI = following month
```

Example:

```text
Disbursed:
15 June

First EMI:
July
```

### If disbursed date is after the 20th:

```text
First EMI = month after next
```

Example:

```text
Disbursed:
25 June

First EMI:
August
```

---

# 21. Boundary Condition

Treat:

```text
1st–20th → next month
21st–31st → month after next
```

Therefore:

```text
20 June → July EMI
21 June → August EMI
```

This boundary must be explicitly tested.

---

# 22. First EMI Calculation

Create:

```javascript
function calculateFirstEMIDate(disbursedDate) {
    const day = disbursedDate.getDate();

    if (day <= 20) {
        return addMonths(disbursedDate, 1);
    }

    return addMonths(disbursedDate, 2);
}
```

Preserve the actual EMI date/day according to the configured system rules where required.

For monthly-count calculations, use month-level logic rather than simply dividing days by 30.

---

# 23. EMI Paid Calculation

The system must calculate:

```text
EMIs Paid
EMIs Remaining
```

Example:

```text
Disbursed Date:
15/01/2025

First EMI:
February 2025

Current Date:
September 2026
```

The system determines the number of scheduled EMI months elapsed.

---

# 24. EMI Remaining

If:

```text
Original Tenure = 48 months
EMIs Paid = 19
```

Then:

```text
EMIs Remaining = 48 - 19

= 29 months
```

Never allow:

```text
EMIs Paid > Original Tenure
```

Clamp:

```javascript
remainingEMIs = Math.max(
    0,
    totalTenureMonths - paidEMIs
);
```

---

# 25. Important: Ask for Original Tenure

To accurately calculate EMIs remaining, the customer must enter:

```text
Original Loan Tenure
```

Example:

```text
48 months
```

If the customer does not know the original tenure, provide:

> **I don't know**

Then offer an alternative calculation using current outstanding / loan details if possible.

Do not invent the tenure.

---

# 26. EMI Placeholder Calculation

The EMI field should initially show a calculated placeholder.

Example:

```text
EMI

₹12,450
```

Placeholder:

> **Estimated EMI: ₹12,450**

But if the customer already knows their EMI, they should be able to enter it manually.

---

# 27. EMI Calculation Formula

If principal, interest rate and tenure are available:

```text
EMI =
P × r × (1+r)^n
-----------------
(1+r)^n - 1
```

Where:

```text
P = Principal
r = Monthly interest rate
n = Number of months
```

Annual rate:

```text
monthlyRate = annualRate / 12 / 100
```

---

# 28. Current Outstanding Calculation

If the customer enters:

```text
Original Principal
Interest Rate
Original Tenure
EMI
EMIs Paid
```

calculate estimated remaining principal using an amortization model.

Conceptually:

```text
Original Principal
        ↓
Interest + Principal allocation
        ↓
EMI 1
        ↓
EMI 2
        ↓
...
        ↓
EMIs Paid
        ↓
Estimated Outstanding
```

Display:

> **Estimated Outstanding**

Do not label this as exact unless the customer enters the actual outstanding from their lender statement.

---

# 29. Prefer Actual Outstanding

If the customer knows the current outstanding balance, allow:

```text
Do you know your current outstanding?

○ Yes
○ No
```

If Yes:

```text
Current Outstanding
₹ __________
```

Use the entered amount as the primary value.

If No:

> We'll estimate your outstanding based on the loan details you provided.

---

# 30. Loan Card UI

Each loan should visually show:

```text
HDFC Bank
Personal Loan

₹8,42,000
Estimated Outstanding

EMI
₹21,450

Interest
14.5%

EMIs Paid
14

EMIs Left
34

[ Transfer Options ]
```

---

# 31. Loan Status

Each loan should receive a status.

Examples:

```text
Potentially Transferable
Not Transferable
Potentially Consolidatable
Needs More Information
```

Use subtle visual indicators.

Do not use aggressive red warnings for ordinary non-transferable loans.

---

# 32. Current Debt Summary

Once loans are added, show a summary.

Example:

```text
YOUR CURRENT DEBT

Total Loans
4

Total Outstanding
₹12.8L

Total Monthly EMI
₹48,600

Estimated EMI Capacity
₹65,000

Current EMI Usage
74.8%
```

---

# 33. EMI Capacity Analysis

Compare:

```text
Estimated EMI Capacity
-
Current EMI
```

Example:

```text
Estimated EMI Capacity
₹65,000

Current EMI
₹48,600

Available EMI Capacity
₹16,400
```

If current EMI exceeds estimated capacity:

```text
Estimated EMI Capacity
₹40,000

Current EMI
₹48,600

EMI Gap
₹8,600
```

Display a clear message:

> **Your current EMI is above the estimated comfortable range.**

---

# 34. EMI Ratio

Calculate:

```text
EMI Ratio =
Total Current EMI / Net Salary × 100
```

Example:

```text
₹48,600 / ₹80,000 × 100

= 60.75%
```

Display:

```text
Current EMI-to-Income
60.8%
```

---

# 35. Transfer Analysis

After all loans are entered:

> **Let's see what may be possible.**

For every loan:

```text
Is loan type transferable?
        ↓
Yes
        ↓
Find lenders
        ↓
Check source loan compatibility
        ↓
Check destination loan
        ↓
Get minimum ROI
        ↓
Calculate new EMI
        ↓
Calculate savings
```

---

# 36. Single Loan Balance Transfer

Example:

```text
Existing Personal Loan

Outstanding:
₹5,00,000

Current ROI:
18%

Current EMI:
₹18,000

Remaining Tenure:
30 months
```

Potential lender:

```text
Indicative ROI:
12.5%

Tenure:
30 months
```

Calculate:

```text
Current EMI
vs
Estimated New EMI
```

Then:

```text
Potential Monthly Saving
```

---

# 37. Consolidation Analysis

This is a major feature.

If customer has:

```text
Personal Loan
₹4L

Credit Card
₹1.5L

App Loan
₹80K

Overdraft
₹2L
```

and a lender supports merging them:

```text
Total Eligible Debt

₹8.3L
```

The system should calculate:

```text
Current Combined EMI
₹______

Potential Consolidated Loan
₹8.3L

Indicative ROI
__%

Potential EMI
₹______

Potential Monthly Difference
₹______
```

---

# 38. Merge Rules

The database must determine whether loans can be merged.

Example:

```javascript
canMerge(
    lender,
    [
        "Personal Loan",
        "Credit Card",
        "App Loan"
    ]
)
```

Possible result:

```text
YES
```

Another lender may return:

```text
NO
```

Therefore, never use a universal merge rule.

---

# 39. Combination Engine

The system should evaluate combinations.

Example:

```text
Loan 1 — Personal Loan
Loan 2 — Credit Card
Loan 3 — App Loan
Loan 4 — Car Loan
```

Possible combinations:

```text
Combination A
Personal + Credit Card + App Loan

Combination B
Personal + Credit Card

Combination C
Personal + App Loan

Combination D
Credit Card + App Loan
```

Then determine which lender/product supports each combination.

---

# 40. Do NOT Automatically Include Non-Transferable Loans

For example:

```text
Car Loan
Home Loan
Gold Loan
```

should not automatically be included in consolidation calculations if the database says they are not eligible.

Display separately:

> **These loans are currently treated as fixed obligations and have not been included in transfer calculations.**

---

# 41. Minimum ROI

Each lender/product should have:

```text
minimumROI
```

Example:

```json
{
  "lender": "Example NBFC",
  "product": "Personal Loan",
  "minimumROI": 11.99
}
```

Display:

> **Indicative rate from 11.99% p.a.**

Never display:

> Guaranteed 11.99%

---

# 42. New EMI Calculation

For every possible scenario:

```text
Loan Amount
+
Interest Rate
+
Tenure
=
Estimated EMI
```

Use the standard reducing-balance EMI formula.

---

# 43. Savings Calculation

Calculate:

```text
Monthly Saving =
Current EMI - New EMI
```

Example:

```text
Current EMI
₹42,000

Estimated New EMI
₹34,500

Potential Monthly Saving
₹7,500
```

Then:

```text
Annual Potential Saving =
Monthly Saving × 12
```

Example:

```text
₹7,500 × 12
=
₹90,000
```

---

# 44. Interest Saving

Calculate total remaining repayment.

Existing:

```text
Current EMI × Remaining EMIs
```

New:

```text
New EMI × New Tenure
```

Then compare estimated total interest after accounting for principal.

Display:

```text
Estimated Interest Difference
₹________
```

Be careful to account for:

- Processing fees
- Transfer charges
- Foreclosure/prepayment charges
- GST where applicable
- Other lender charges

If these values are unavailable, label savings as:

> **Before applicable fees and charges**

---

# 45. More Accurate Savings

Create:

```text
Gross Saving
```

and:

```text
Estimated Net Saving
```

Formula:

```text
Net Saving =
Gross Saving
-
Processing Fees
-
Foreclosure Charges
-
Transfer Charges
-
Other Known Charges
```

Only calculate net savings when fee data is available.

---

# 46. Results Page

The results should begin with the most important insight.

Example:

> **Your current EMI is ₹48,600/month**

Then:

```text
Estimated EMI Capacity
₹65,000

Current EMI
₹48,600

Current EMI Ratio
60.8%

Total Outstanding
₹12.8L
```

---

# 47. Potential Savings Section

If eligible options exist:

## Heading

> **You may have options to reduce your monthly EMI**

Example:

```text
Current EMI
₹48,600

Potential EMI*
₹39,200

Potential Monthly Difference*
₹9,400
```

Footnote:

> *Illustrative estimate based on the information provided. Final rate, eligibility, tenure and savings depend on lender approval and applicable charges.

---

# 48. Recommended Options

Rank possible scenarios.

Example:

```text
OPTION 1

Consolidate 3 eligible loans

Current EMI
₹42,500

Estimated EMI*
₹34,800

Potential Difference*
₹7,700/month

Indicative ROI*
12.49%

[Explore This Option]
```

---

# 49. Ranking Algorithm

Possible ranking factors:

```text
1. Potential EMI reduction
2. Net savings
3. Interest reduction
4. Number of loans consolidated
5. Lower ROI
6. Suitable tenure
```

Do not rank solely on ROI.

A lower ROI can still result in a higher EMI depending on tenure.

---

# 50. Recommended Result Labels

Use:

```text
Best Potential EMI Reduction
Best Potential Interest Saving
Maximum Loans Consolidated
Lowest Indicative ROI
```

Do not use:

```text
Guaranteed Best
Guaranteed Lowest Rate
Guaranteed Approval
```

---

# 51. Loans That Cannot Be Transferred

Show a separate section:

## Existing Loans Not Included

Example:

```text
Car Loan
₹7,500 EMI

Home Loan
₹18,000 EMI

Gold Loan
₹4,000 EMI
```

Message:

> These loans have been excluded from the transfer scenarios based on the current lender rules in our database.

---

# 52. Missing Information

The system should identify missing information.

Example:

```text
Your Credit Card balance is missing.
```

Instead of blocking the entire analysis, show:

> Add outstanding balance to calculate transfer options more accurately.

Use:

```text
[Add Missing Information]
```

---

# 53. Customer-Friendly Language

Avoid financial jargon.

Instead of:

```text
Debt-to-Income Ratio
```

prefer:

> **EMI-to-Income**

Instead of:

```text
Refinancing eligibility
```

prefer:

> **Potential Transfer Options**

Instead of:

```text
Amortization schedule
```

prefer:

> **Repayment Breakdown**

The existing brand guidelines specifically call for simple English suitable for Indian customers.

---

# 54. UI Design

Follow Credit Expert India's existing design language.

Primary colors:

```text
Espresso       #180D0A
Warm Ivory     #F0EAE5
Warm Beige     #E2D6CC
Muted Sage     #829679
Earth Brown    #785E47
Warm Gray      #A8A29D
Error          #E74747
```

Typography:

```text
Manrope
```

Use:

- Large financial numbers
- Rounded containers
- Soft neutral backgrounds
- Minimal borders
- Subtle animations
- Generous whitespace

The existing brand system specifies Manrope, warm neutral colors, rounded cards and restrained animation.

---

# 55. Desktop Layout

Recommended:

```text
┌────────────────────────────────────────────────────────────┐
│ Credit Expert India                         Talk to Expert │
├────────────────────────────────────────────────────────────┤
│                                                            │
│       SEE HOW MUCH EMI YOU CAN MANAGE                      │
│                                                            │
│       Monthly Net Salary                                   │
│       ₹80,000                                              │
│                                                            │
│       Estimated EMI Capacity                               │
│       ₹40,000 / month                                      │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│       YOUR EXISTING LOANS                                  │
│                                                            │
│  Loan 1                                                    │
│  HDFC Bank | Personal Loan                                 │
│                                                            │
│  Loan 2                                                    │
│  ICICI Bank | Credit Card                                  │
│                                                            │
│                 + Add Another Loan                         │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│       YOUR DEBT SUMMARY                                    │
│                                                            │
│       ₹48,600          ₹12.8L          60.8%              │
│       Monthly EMI      Outstanding     EMI/Income         │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│       POTENTIAL OPTIONS                                    │
│                                                            │
│       Current EMI             Potential EMI*               │
│       ₹48,600                 ₹39,200                      │
│                                                            │
│       Potential Difference*   ₹9,400/month                │
│                                                            │
│                  [Explore My Options]                      │
└────────────────────────────────────────────────────────────┘
```

---

# 56. Mobile Layout

Mobile is extremely important because this is a customer-facing Indian financial tool.

Use:

```text
Salary
↓
EMI Capacity
↓
Loans
↓
Debt Summary
↓
Transfer Options
↓
Potential Savings
↓
CTA
```

Each loan should become a vertically stacked card.

Do not create a wide desktop-style spreadsheet on mobile.

---

# 57. Loan Card Mobile

Example:

```text
HDFC Bank
Personal Loan

Outstanding
₹5,42,000

EMI
₹18,400

ROI
16.5%

EMIs Paid
14

EMIs Left
22

Potential Transfer
✓
```

Then:

```text
View Transfer Options
```

---

# 58. Add Loan UX

The add-loan flow should be simple.

Step:

```text
+ Add Another Loan
```

opens:

```text
Which lender?

[ Search Bank / NBFC ]

Loan Type

[ Personal Loan ▼ ]

Disbursed Date

[ DD/MM/YYYY ]

Original Amount

[ ₹ ]

Current Outstanding

[ ₹ ]

Interest Rate

[ % ]

Original Tenure

[ months ]

Current EMI

[ ₹ ]

[ Save Loan ]
```

---

# 59. Smart Defaults

If the customer enters:

```text
Original Amount
ROI
Tenure
```

calculate:

```text
Estimated EMI
```

and show it as:

> Estimated EMI

The customer can override it by entering the actual EMI.

---

# 60. Calculation Priority

Use this priority:

### Outstanding

```text
Actual user-entered outstanding
        ↓
otherwise
Calculated outstanding
```

### EMI

```text
Actual user-entered EMI
        ↓
otherwise
Calculated EMI
```

### Transfer Rules

```text
Lender database
        ↓
Default loan-type rule
```

---

# 61. Data Model

Suggested structure:

```javascript
CustomerProfile {
    monthlyNetSalary
}
```

Loan:

```javascript
Loan {
    id
    lenderId
    lenderName
    isCustomLender

    loanType

    disbursedDate
    firstEMIDate

    originalAmount
    currentOutstanding

    interestRate
    emi

    originalTenureMonths

    paidEMIs
    remainingEMIs

    balanceTransferEligible
}
```

---

# 62. Lender Data Model

```javascript
Lender {
    id
    name
    aliases
    type
    active
}
```

Example:

```javascript
{
    id: "hdfc-bank",
    name: "HDFC Bank",
    aliases: [
        "HDFC",
        "HDFC Bank Ltd"
    ],
    type: "BANK",
    active: true
}
```

Aliases are important because customers may type:

```text
HDFC
HDFC Bank
HDFC Bank Ltd
```

All should resolve to the same lender.

---

# 63. Product Rule Data Model

```javascript
LenderProductRule {
    lenderId

    destinationLoanType

    acceptedSourceLoanTypes

    mergeAllowed

    minimumROI

    maximumROI

    minimumTenureMonths
    maximumTenureMonths

    minimumAmount
    maximumAmount

    processingFee
    foreclosureCharge

    active
}
```

---

# 64. Example Rule

```javascript
{
    lenderId: "example-bank",

    destinationLoanType: "PERSONAL_LOAN",

    acceptedSourceLoanTypes: [
        "PERSONAL_LOAN",
        "CREDIT_CARD",
        "APP_LOAN"
    ],

    mergeAllowed: true,

    minimumROI: 11.99,

    maximumTenureMonths: 60
}
```

---

# 65. Admin Configuration

The future admin panel should allow authorized users to modify:

### Lenders

```text
Add Bank
Edit Bank
Disable Bank
Add NBFC
```

### Loan Types

```text
Add Loan Type
Edit Loan Type
```

### Transfer Rules

```text
Source Loan
Destination Loan
Transfer Allowed
```

### Merge Rules

```text
Can Merge
Cannot Merge
```

### ROI

```text
Minimum ROI
Maximum ROI
```

### Fees

```text
Processing Fee
Foreclosure Fee
Other Charges
```

---

# 66. Versioning

Lender rules should be versioned.

Example:

```text
Rule Version
2026-09-01
```

This prevents historical calculations from becoming confusing when lender policies change.

---

# 67. Important Business Logic Separation

Do NOT put lender rules directly inside UI components.

Bad:

```javascript
if (loanType === "personal") {
   if (bank === "XYZ") ...
}
```

Instead:

```text
UI
 ↓
Eligibility Engine
 ↓
Lender Rules Service
 ↓
Results
```

This allows the lender database to change without rewriting the frontend.

---

# 68. Eligibility Engine

Create a dedicated function:

```javascript
analyzeCustomerDebt(customer, loans, lenderRules)
```

It should return:

```javascript
{
    salary,
    estimatedEmiCapacity,

    totalCurrentEMI,
    emiRatio,

    totalOutstanding,

    loans: [],

    transferableLoans: [],

    nonTransferableLoans: [],

    consolidationOptions: [],

    potentialSavings: []
}
```

---

# 69. Transfer Engine

Create:

```javascript
findTransferOptions(loan, lenderRules)
```

Return:

```javascript
[
    {
        lender,
        destinationProduct,
        indicativeROI,
        estimatedEMI,
        potentialMonthlySaving,
        estimatedInterestSaving
    }
]
```

---

# 70. Consolidation Engine

Create:

```javascript
findConsolidationOptions(loans, lenderRules)
```

It should:

1. Identify eligible loans.
2. Generate supported combinations.
3. Check lender rules.
4. Calculate total transferable outstanding.
5. Calculate current combined EMI.
6. Calculate potential consolidated EMI.
7. Calculate potential monthly difference.
8. Calculate estimated savings.
9. Rank results.

---

# 71. Prevent Invalid Scenarios

Never allow:

```text
New EMI < ₹0
ROI < 0
Tenure < 1 month
Outstanding < 0
EMIs Paid < 0
EMIs Remaining < 0
```

Also validate:

```text
Disbursed date cannot be in the future
EMI cannot be negative
Interest rate cannot be negative
Salary must be greater than 0
```

---

# 72. Loan Fully Paid

If:

```text
EMIs Remaining = 0
```

show:

```text
Loan Completed
```

and:

```text
Outstanding
₹0
```

Do not show it as a transfer candidate.

---

# 73. Current Date

The calculation engine must use the actual current date.

Do not hard-code:

```text
2026
```

Use:

```javascript
new Date()
```

or the backend server date.

---

# 74. Calculation Precision

Internally calculate using full precision.

Display:

```text
₹12,345
```

instead of:

```text
₹12,345.67
```

unless detailed calculations are opened.

Interest rates can display:

```text
12.49%
```

---

# 75. Results Explanation

Every major result should have a small explanation.

Example:

### Estimated EMI Capacity

> Based on your monthly net salary and the EMI ratio configured for this calculation.

### Estimated Outstanding

> Calculated from the loan information provided. Your actual foreclosure/outstanding amount may differ.

### Potential Saving

> Difference between your current EMI and the estimated EMI under the selected scenario, before applicable charges unless otherwise stated.

---

# 76. Trust / Compliance Message

At the bottom of results:

> **Important:** This calculator provides indicative estimates based on the information you enter. Actual eligibility, interest rate, loan amount, tenure, fees and approval are determined by the respective lender and may vary after verification.

This is consistent with Credit Expert India's existing requirement for transparent financial communication and clear lender/partner disclosure.

---

# 77. Primary CTA

After showing useful results:

> **Talk to a Credit Expert**

Secondary:

> **Modify My Loans**

Optional:

> **Start Again**

The experience should not aggressively push:

> Apply Now

The brand guidelines specifically favor problem-focused CTAs such as “Find My Options”, “Calculate My EMI”, “Explore Solutions” and “Talk to an Expert.”

---

# 78. Lead Capture

Only ask for customer contact information after delivering useful analysis.

Suggested:

```text
Want help understanding these options?

Name
[____________]

Mobile Number
[____________]

[Talk to a Credit Expert]
```

Do not force phone number entry before showing the initial calculation.

---

# 79. WhatsApp Conversion

Optional CTA:

> **Discuss My Options on WhatsApp**

The current Credit Expert India website strategy also prioritizes WhatsApp/contact conversion.

---

# 80. Recommended UX Psychology

The user should experience:

```text
"I have too many EMIs."
        ↓
"Let me enter my salary."
        ↓
"Now I understand my EMI capacity."
        ↓
"Let me add my loans."
        ↓
"Now I can see where my money goes."
        ↓
"Oh, some of these loans may be transferable."
        ↓
"These lenders may potentially consolidate them."
        ↓
"I could potentially reduce my EMI."
        ↓
"I want an expert to help me."
```

This directly supports the brand progression:

```text
PROBLEM
↓
UNDERSTANDING
↓
EXPERT GUIDANCE
↓
SOLUTION
↓
ACTION
```

which is already defined for Credit Expert India.

---

# 81. Animation

Use subtle animation only.

Examples:

### Salary calculation

```text
₹50,000
   ↓
₹25,000 EMI Capacity
```

Animate the number.

### Debt summary

Numbers count up once.

### Savings

```text
₹48,600
      ↓
₹39,200
```

Use a smooth transition.

Avoid flashy fintech animations.

The existing brand specifically calls for slow, smooth, organic and purposeful animation.

---

# 82. Progress Indicator

Use:

```text
01 Income
02 Existing Loans
03 Analysis
04 Options
```

Example:

```text
●────●────○────○

Income
Existing Loans
Analysis
Options
```

On mobile this should remain compact.

---

# 83. Empty State

When no loans are added:

```text
No loans added yet.

Add your existing loans to see your current EMI
burden and potential options.

[ + Add My First Loan ]
```

---

# 84. Example Complete Scenario

Customer:

```text
Net Salary:
₹80,000
```

System:

```text
Estimated EMI Capacity:
₹40,000
```

Customer adds:

```text
HDFC Personal Loan
EMI ₹18,000

ICICI Credit Card
EMI ₹8,000

App Loan
EMI ₹6,500

Car Loan
EMI ₹9,000
```

System:

```text
Total EMI
₹41,500

Estimated EMI Capacity
₹40,000

EMI Difference
-₹1,500
```

Then:

```text
Potentially Transferable

Personal Loan
Credit Card
App Loan
```

Car loan:

```text
Not included in transfer scenario
```

If a lender supports merging:

```text
Eligible Outstanding
₹6.8L

Current Eligible EMI
₹32,500

Potential Consolidated EMI*
₹27,400

Potential Monthly Difference*
₹5,100
```

Then:

> **You may have an opportunity to simplify 3 repayments into one.**

CTA:

> **Explore This Option**

---

# 85. Scenario Comparison

Allow users to compare:

```text
CURRENT

4 Loans
₹41,500 EMI
```

vs.

```text
OPTION A

2 Loans
₹36,800 EMI
```

vs.

```text
OPTION B

1 Consolidated Loan
₹33,900 EMI
```

Show:

| Metric | Current | Option A | Option B |
|---|---:|---:|---:|
| Loans | 4 | 2 | 1 |
| EMI | ₹41,500 | ₹36,800 | ₹33,900 |
| Difference | — | ₹4,700 | ₹7,600 |
| ROI | — | 13.5%* | 12.9%* |

---

# 86. Important: Do Not Optimize Only for Lower EMI

The system must explain:

> A lower EMI does not always mean lower total cost.

For example:

```text
Existing:
₹20,000 × 24 months

New:
₹14,000 × 48 months
```

The new EMI is lower but the customer may pay substantially longer.

Therefore always show:

```text
Monthly EMI
+
Remaining Tenure
+
Estimated Total Repayment
+
Estimated Interest
```

---

# 87. Best Option Logic

A recommendation should consider:

```text
Monthly EMI reduction
+
Total interest
+
Tenure
+
Fees
+
Number of loans consolidated
+
ROI
```

The tool should avoid recommending an option purely because:

```text
EMI is lowest
```

---

# 88. Architecture

Recommended:

```text
Frontend
React / Next.js
        ↓
Eligibility Calculation Layer
        ↓
API / Backend
        ↓
Lender Rules Database
        ↓
Admin Configuration
```

If the initial version is completely client-side, keep the rules in a separate JSON/config module so they can later move to a backend database.

---

# 89. Suggested Frontend Components

```text
EligibilityPage
│
├── SalaryInput
│
├── EmiCapacityCard
│
├── LoanManager
│   ├── LoanCard
│   ├── AddLoanButton
│   └── LoanForm
│
├── DebtSummary
│
├── EmiBurdenIndicator
│
├── TransferAnalysis
│   ├── TransferableLoans
│   ├── NonTransferableLoans
│   └── ConsolidationOptions
│
├── ScenarioComparison
│
├── SavingsSummary
│
├── Disclaimer
│
└── ExpertCTA
```

---

# 90. State Management

Customer state:

```javascript
{
    salary: 80000,

    loans: [
        {
            id: "...",
            lenderId: "...",
            loanType: "PERSONAL_LOAN",
            disbursedDate: "...",
            originalAmount: 500000,
            outstanding: 420000,
            roi: 16.5,
            emi: 18000,
            tenureMonths: 36,
            paidEMIs: 14,
            remainingEMIs: 22
        }
    ]
}
```

Calculated state should be derived rather than manually stored wherever possible.

---

# 91. Testing Requirements

Create unit tests for:

### EMI

```text
Known principal
Known ROI
Known tenure
```

### First EMI

```text
20th → next month
21st → month after next
```

### EMI paid

Test:

```text
0 EMIs
1 EMI
Multiple EMIs
Fully paid
```

### Remaining EMI

```text
Tenure - paid
```

### Outstanding

Compare against known amortization examples.

### Transfer

Test:

```text
Transfer allowed
Transfer not allowed
Unknown lender
Custom lender
```

### Consolidation

Test:

```text
2 loans
3 loans
5 loans
Mixed transferable/non-transferable loans
```

---

# 92. Edge Cases

Handle:

```text
Leap years
February
31st-day disbursal
Month-end dates
Future disbursal date
Fully paid loan
Zero outstanding
Zero EMI
Very high salary
Very low salary
Unknown bank
Unknown loan type
Missing ROI
Missing tenure
Missing outstanding
```

---

# 93. Database Strategy

Do NOT embed the entire lender list directly inside React components.

Use:

```text
/lender-data
    lenders.json
    products.json
    transfer-rules.json
    merge-rules.json
```

Later migrate to:

```text
Firestore
PostgreSQL
MySQL
```

depending on the backend.

---

# 94. Admin-Controlled Rules

Eventually the admin should be able to change:

```text
Bank list
NBFC list

Loan types

Transfer eligibility

Merge eligibility

Minimum ROI

Maximum ROI

Tenure

Loan amount

Processing fees

Foreclosure charges

Default EMI ratio
```

without changing frontend code.

---

# 95. Security

Never expose sensitive customer information unnecessarily.

If lead data is stored:

```text
Use HTTPS
Validate inputs
Sanitize inputs
Use secure backend APIs
Restrict admin access
Use authentication for admin
Do not expose lender configuration editing publicly
```

---

# 96. Privacy

The tool should clearly state why information is being collected.

If the calculator works without storing personal information:

> **Your calculation can be completed without submitting your contact details.**

If information is stored:

> Explain what is stored, why, and how it is used.

This fits the broader Credit Expert India requirement for responsible handling of financial information and clear privacy/data disclosures.

---

# 97. AI Agent Requirements

The AI coding agent must:

1. Build the calculator as a reusable module.
2. Separate UI from business logic.
3. Separate lender rules from business logic.
4. Make all lender rules configurable.
5. Implement the EMI calculation accurately.
6. Implement the 20/21 disbursal-date rule exactly.
7. Support unlimited loans.
8. Support searchable lenders.
9. Support custom lender names.
10. Support transfer eligibility.
11. Support consolidation.
12. Support lender-specific merge rules.
13. Calculate estimated savings.
14. Clearly distinguish estimates from guarantees.
15. Build responsive mobile-first UX.
16. Add validation and error states.
17. Add unit tests.
18. Keep the architecture ready for a backend/database.
19. Never hard-code lender-specific rules inside UI components.
20. Never invent lender policies or ROI values.

---

# 98. Data Loading Rule

The lender database will be supplied separately.

When the lender report/database is provided:

### Extract:

```text
Bank/NBFC Name
Loan Type
Transfer From
Transfer To
Merge Supported
Minimum ROI
Maximum ROI
Tenure
Fees
Other Conditions
```

Normalize lender names.

Example:

```text
HDFC
HDFC Bank
HDFC Bank Ltd.
```

→

```text
HDFC Bank
```

---

# 99. Missing Lender Data

If the supplied report does not contain information:

DO NOT guess.

Use:

```text
Data unavailable
```

or:

> **We need more information to determine this option.**

Never fabricate:

```text
minimum ROI
transfer eligibility
merge eligibility
fees
```

---

# 100. Final Result Philosophy

The final result should not feel like:

> "Here is a loan offer."

It should feel like:

> **"Here is what is happening with your debt, and here are the options you may want to explore."**

This is important because Credit Expert India is intended to feel like a financial problem-solving partner rather than a generic loan marketplace.

---

# 101. Final Page Structure

```text
HEADER
│
├── Credit Expert India
├── Tools
├── Solutions
└── Talk to an Expert
│
↓
STEP 1 — YOUR INCOME
│
├── Net Monthly Salary
└── Estimated EMI Capacity
│
↓
STEP 2 — YOUR LOANS
│
├── Loan 1
├── Loan 2
├── Loan 3
└── + Add Another Loan
│
↓
STEP 3 — YOUR DEBT SUMMARY
│
├── Total Outstanding
├── Total EMI
├── EMI-to-Income
├── EMI Capacity
└── Available/Excess EMI
│
↓
STEP 4 — LOAN ANALYSIS
│
├── Transferable
├── Non-transferable
└── Missing Information
│
↓
STEP 5 — POTENTIAL OPTIONS
│
├── Balance Transfer
├── Consolidation
└── Loan Merge
│
↓
STEP 6 — SAVINGS
│
├── Current EMI
├── Estimated New EMI
├── Potential Monthly Difference
├── Potential Annual Difference
└── Estimated Interest Difference
│
↓
STEP 7 — COMPARE OPTIONS
│
├── Option A
├── Option B
└── Option C
│
↓
CTA
│
└── Talk to a Credit Expert
```

---

# 102. MVP Development Phases

## Phase 1 — Calculator

Build:

```text
Salary
↓
EMI Capacity
↓
Loan Entry
↓
EMI Calculation
↓
Paid/Remaining EMI
↓
Debt Summary
```

## Phase 2 — Transfer Engine

Add:

```text
Loan classification
↓
Transfer rules
↓
Lender search
↓
Eligible lenders
```

## Phase 3 — Consolidation

Add:

```text
Multiple loans
↓
Merge combinations
↓
Lender matching
↓
New EMI
↓
Savings
```

## Phase 4 — Lender Database

Add:

```text
Banks
NBFCs
Products
ROI
Tenure
Fees
Transfer rules
Merge rules
```

## Phase 5 — Admin

Add:

```text
Lender management
Rule management
ROI management
Product management
```

## Phase 6 — Lead Conversion

Add:

```text
Customer details
WhatsApp
Expert callback
CRM integration
```

---

# 103. Definition of Done

The feature is complete only when a customer can:

```text
✓ Enter salary

✓ See estimated EMI capacity

✓ Add unlimited loans

✓ Search banks/NBFCs

✓ Enter custom lender

✓ Select loan type

✓ Enter disbursal date

✓ Get correct first EMI month

✓ See EMIs paid

✓ See EMIs remaining

✓ See current EMI burden

✓ See outstanding debt

✓ Identify transferable loans

✓ Identify non-transferable loans

✓ Find compatible lenders

✓ Find potential consolidation options

✓ See indicative ROI

✓ Calculate estimated new EMI

✓ Calculate potential monthly savings

✓ Calculate potential interest savings

✓ Compare scenarios

✓ Understand assumptions

✓ Contact Credit Expert India
```

---

# 104. Most Important Instruction to the AI Agent

**Do not treat this as a normal EMI calculator.**

Build it as a:

> **Customer Debt Eligibility + Balance Transfer + Consolidation Analysis Engine**

The core intelligence is:

```text
INCOME
   ↓
EMI CAPACITY
   ↓
EXISTING DEBT
   ↓
LOAN-BY-LOAN ANALYSIS
   ↓
TRANSFER ELIGIBILITY
   ↓
LENDER RULE MATCHING
   ↓
CONSOLIDATION
   ↓
NEW EMI
   ↓
POTENTIAL SAVINGS
   ↓
CUSTOMER ACTION
```

The objective is not simply to tell the customer:

> "Your EMI is ₹40,000."

The objective is to tell them:

> **"You currently pay ₹48,000 across 4 loans. Your estimated EMI capacity is ₹40,000. 3 of your loans may have potential transfer/consolidation options. Here are the indicative scenarios and how much your monthly repayment could potentially change."**

That is the core product experience for Credit Expert India's **Reduce → Manage → Clear** positioning.