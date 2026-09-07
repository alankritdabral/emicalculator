# India Personal Loan Balance Transfer & Debt Consolidation Lender Master Database

**Purpose:** Working reference for Credit Expert India to route
customers with existing debt to suitable private banks and NBFCs.

**Research date:** September 2026\
**Market:** India\
**Scope:** Private-sector banks + major retail/NBFC lenders\
**Primary use:** Personal-loan balance transfer (BT), debt
consolidation, multiple-loan consolidation, credit-card debt
consolidation, digital/app-loan consolidation, overdraft/refinancing and
top-up routing.

> **Important:** This is a lender-policy research database, not a
> promise of approval. A lender offering a personal loan does **not**
> automatically mean it will refinance every type of existing liability.
> Final acceptance depends on the lender's current credit policy,
> customer profile, loan vintage, bureau history, income, FOIR/DBR,
> employer/business profile, geography, documents and the exact
> liability being closed.

------------------------------------------------------------------------

# 1. The Most Important Rule

## Product availability ≠ liability takeover

Do not use a simple matrix such as:

> "Lender offers Personal Loan + Credit Card + OD = lender can
> consolidate PL + CC + OD."

That conclusion is unsafe.

The operational question is:

> **Will this lender use its new loan to close this customer's existing
> liability?**

For Credit Expert India's CRM, the correct matrix is:

  -----------------------------------------------------------------------
  Field                               Meaning
  ----------------------------------- -----------------------------------
  `PL_BT`                             Existing personal loan can
                                      potentially be
                                      transferred/refinanced

  `MULTI_PL`                          Multiple personal loans can
                                      potentially be consolidated

  `CC_DEBT`                           Existing credit-card outstanding
                                      can potentially be consolidated

  `APP_LOAN`                          Digital/app-loan outstanding may
                                      potentially be consolidated

  `OD_TAKEOVER`                       Existing overdraft/credit-line
                                      liability can potentially be
                                      refinanced

  `MIXED_DEBT`                        More than one liability type can
                                      potentially be consolidated

  `TOP_UP`                            Additional amount may be available
                                      above takeover amount

  `DIRECT_CLOSURE`                    New lender may pay existing lender
                                      directly

  `POLICY_CONFIRMATION`               Must be confirmed by lender/channel
                                      before promising customer
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 2. Evidence Legend

  -----------------------------------------------------------------------
  Symbol                              Meaning
  ----------------------------------- -----------------------------------
  🟢                                  Strong/public evidence that the
                                      lender markets or documents this
                                      use case

  🟡                                  Possible / channel-policy dependent
                                      / insufficient public evidence

  🔴                                  No reliable public evidence found;
                                      do not market as available

  ⚪                                  Not researched deeply enough /
                                      current policy must be checked
  -----------------------------------------------------------------------

**Critical rule:** 🟡 does not mean "yes". It means **verify before
submitting or promising**.

------------------------------------------------------------------------

# 3. Private-Sector Bank Universe

The Department of Financial Services' current private-sector-bank
listing includes the following banks: Axis Bank, Bandhan Bank, CSB Bank,
City Union Bank, DCB Bank, Dhanlaxmi Bank, Federal Bank, HDFC Bank,
ICICI Bank, IndusInd Bank, IDFC FIRST Bank, Jammu & Kashmir Bank,
Karnataka Bank, Karur Vysya Bank, Kotak Mahindra Bank, Nainital Bank,
RBL Bank, South Indian Bank, Tamilnad Mercantile Bank, YES Bank and IDBI
Bank.

For the debt-consolidation use case, not all of these banks are equally
relevant. The first priority should be lenders with clearly documented
personal-loan BT/debt-consolidation products.

------------------------------------------------------------------------

# 4. Private Bank Master Matrix

  ------------------------------------------------------------------------------------------------------------
  Private Bank  PL → PL   Multiple CC Debt   App/Digital         OD   Mixed   Top-Up     Headline Confidence
                                PL                  Loan   Takeover    Debt          PL/BT Rate\* 
  ------------- ------- ---------- ------- ------------- ---------- ------- -------- ------------ ------------
  **HDFC Bank**      🟢      🟢/🟡      🟡            🟡         🔴      🟡       🟢     \~9.99%+ High

  **ICICI            🟢         🟡      🟡            🟡         🔴      🟡       🟢 \~10.85% BT+ High
  Bank**                                                                                          

  **Kotak            🟢         🟢      🟡            🟡         🔴   🟢/🟡       🟢    \~10.99%+ High
  Mahindra                                                                                        
  Bank**                                                                                          

  **IDFC FIRST       🟢         🟡      🟡            🟡         🔴      🟡    🟢/🟡  \~9.99% BT+ High
  Bank**                                                                                          

  **IndusInd         🟢         🟢   🟢/🟡            🟡         🔴      🟢    🟢/🟡    \~10.49%+ High
  Bank**                                                                                          

  **Axis Bank**   🟢/🟡         🟡      🟡            🟡         🔴      🟡       🟡   \~9.99%+\* Medium

  **Federal          🟡         🟡      🟡            🟡         🔴      🟡       🟡       \~11%+ Medium
  Bank**                                                                                          

  **YES Bank**       🟡         🟡      🟡            🟡         🔴      🟡       🟡       \~11%+ Medium

  **RBL Bank**       🟡         🟡      🟡            🟡         🔴      🟡       🟡       \~14%+ Medium

  **Bandhan          🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Medium
  Bank**                                                                                          

  **South            🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low/Medium
  Indian Bank**                                                                                   

  **Karnataka        🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low/Medium
  Bank**                                                                                          

  **Karur Vysya      🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low/Medium
  Bank**                                                                                          

  **City Union       🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low
  Bank**                                                                                          

  **CSB Bank**       🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low

  **DCB Bank**       🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low/Medium

  **Dhanlaxmi        🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low
  Bank**                                                                                          

  **J&K Bank**       🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low/Medium

  **Nainital         🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low
  Bank**                                                                                          

  **Tamilnad         🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Low
  Mercantile                                                                                      
  Bank**                                                                                          

  **IDBI Bank**      🟡         🟡      🟡            🟡         🔴      🟡       🟡 Policy based Medium
  ------------------------------------------------------------------------------------------------------------

\* Headline rates change frequently and are not necessarily the exact
rate available for a balance-transfer case.

------------------------------------------------------------------------

# 5. Priority Private Banks

## 5.1 HDFC Bank

### Best use

-   Existing personal-loan BT
-   Prime salaried borrowers
-   Higher-quality bureau profiles
-   PL refinance + possible top-up
-   Customers who need a mainstream bank rather than an NBFC

### Working classification

  Liability                 Status
  ------------------------- --------
  PL → PL                   🟢
  Multiple PL               🟢/🟡
  Credit-card outstanding   🟡
  App loan                  🟡
  Existing OD               🔴
  Mixed PL + CC             🟡
  Top-up                    🟢

HDFC publicly advertises personal-loan balance transfer and a starting
rate around 9.99% on its current personal-loan material.

### Operational note

Do not tell a customer:

> "HDFC will consolidate all your loans."

Instead:

> "HDFC is a strong option for personal-loan balance transfer.
> Credit-card/app-loan/mixed liabilities need case-level policy
> confirmation."

------------------------------------------------------------------------

# 6. ICICI Bank

### Best use

-   Personal-loan balance transfer
-   Prime/salaried borrowers
-   PL BT with top-up
-   Existing loan from another bank/NBFC

### Working classification

  Liability                 Status
  ------------------------- --------
  PL → PL                   🟢
  Multiple PL               🟡
  Credit-card outstanding   🟡
  App loan                  🟡
  Existing OD               🔴
  Mixed PL + CC             🟡
  Top-up                    🟢

ICICI's current personal-loan BT material explicitly supports
transferring an existing personal loan from another financial
institution, with top-up availability depending on eligibility.

------------------------------------------------------------------------

# 7. Kotak Mahindra Bank

### Best use

-   PL BT
-   Multiple small loans
-   Debt consolidation
-   Prime salaried customers

Kotak's published educational material specifically explains that
personal-loan balance transfer can be used to move an existing loan to a
new lender and discusses merging multiple small loans into a single
loan.

### Working classification

  Liability                 Status
  ------------------------- --------
  PL → PL                   🟢
  Multiple PL               🟢
  Credit-card outstanding   🟡
  App loan                  🟡
  Existing OD               🔴
  Mixed debt                🟢/🟡
  Top-up                    🟢

### Recommended routing

If customer has:

> PL ₹2L + PL ₹1.5L + PL ₹80k

**Kotak should be one of the first lenders checked.**

------------------------------------------------------------------------

# 8. IDFC FIRST Bank

### Best use

-   PL BT
-   Prime digital customers
-   Salaried customers
-   BT + possible additional funding

### Working classification

  Liability     Status
  ------------- --------
  PL → PL       🟢
  Multiple PL   🟡
  Credit card   🟡
  App loan      🟡
  OD            🔴
  Mixed debt    🟡
  Top-up        🟢/🟡

IDFC FIRST publicly advertises personal-loan balance transfer at a
starting rate around 9.99%.

------------------------------------------------------------------------

# 9. IndusInd Bank

IndusInd is especially interesting for Credit Expert India because it
explicitly markets a **Personal Loan for Debt Consolidation**.

Its current debt-consolidation page says the product can merge multiple
debts into one repayment and advertises rates starting around 10.49%. It
also describes loan amounts starting at ₹30,000 and extending up to ₹5
lakh on the referenced digital product.

### Working classification

  Liability          Status
  ------------------ --------
  PL → PL            🟢
  Multiple PL        🟢
  Credit-card debt   🟢/🟡
  App loan           🟡
  OD                 🔴
  Mixed debt         🟢/🟡
  Top-up             🟢/🟡

### Why this lender matters

Instead of treating IndusInd only as a generic PL lender, classify it
as:

> **Debt Consolidation -- Priority Bank**

------------------------------------------------------------------------

# 10. Axis Bank

Axis is a major private-bank option for PL refinancing and
debt-consolidation cases.

### Working classification

  Liability          Status
  ------------------ --------
  PL → PL            🟢/🟡
  Multiple PL        🟡
  Credit-card debt   🟡
  App loan           🟡
  OD                 🔴
  Mixed debt         🟡
  Top-up             🟡

Use current lender/channel confirmation before quoting a specific BT
rate.

------------------------------------------------------------------------

# 11. Federal Bank

### Working classification

  Liability     Status
  ------------- --------
  PL → PL       🟡
  Multiple PL   🟡
  Credit card   🟡
  App loan      🟡
  OD            🔴
  Mixed         🟡
  Top-up        🟡

Federal can be maintained as a secondary/private-bank routing option,
but the exact BT policy should be verified before marketing specific
consolidation scenarios.

------------------------------------------------------------------------

# 12. YES Bank

### Working classification

  Liability     Status
  ------------- --------
  PL → PL       🟡
  Multiple PL   🟡
  Credit card   🟡
  App loan      🟡
  OD            🔴
  Mixed         🟡
  Top-up        🟡

Use as a secondary lender until current channel policy is confirmed.

------------------------------------------------------------------------

# 13. RBL Bank

### Working classification

  Liability     Status
  ------------- --------
  PL → PL       🟡
  Multiple PL   🟡
  Credit card   🟡
  App loan      🟡
  OD            🔴
  Mixed         🟡
  Top-up        🟡

RBL can be retained in the database, but should not be treated as a
guaranteed consolidation lender without current policy evidence.

------------------------------------------------------------------------

# 14. Smaller Private Banks

The following banks should exist in the database even if they are not
first-choice consolidation lenders:

-   Bandhan Bank
-   CSB Bank
-   City Union Bank
-   DCB Bank
-   Dhanlaxmi Bank
-   Federal Bank
-   Jammu & Kashmir Bank
-   Karnataka Bank
-   Karur Vysya Bank
-   Nainital Bank
-   South Indian Bank
-   Tamilnad Mercantile Bank
-   IDBI Bank

### Recommended status

Keep them as:

> `ACTIVE_LENDER = TRUE`\
> `CONSOLIDATION_CONFIDENCE = POLICY_CHECK`

Do not assign a "Yes" to CC/app/OD takeover unless the lender or channel
confirms it.

------------------------------------------------------------------------

# 15. NBFC Universe

Major NBFC / finance-company names worth tracking:

### Priority unsecured / consumer lenders

1.  Bajaj Finance
2.  Tata Capital
3.  Shriram Finance
4.  L&T Finance
5.  Aditya Birla Finance
6.  Piramal Finance
7.  Poonawalla Fincorp
8.  Aditya Birla Capital group entities
9.  Fullerton India / SMFG India Credit
10. Hero FinCorp
11. Cholamandalam Investment & Finance
12. Mahindra Finance
13. HDB Financial Services
14. IIFL Finance
15. DMI Finance
16. Clix Capital
17. Fibe / EarlySalary
18. Navi Finserv
19. Moneyview / partner-lender ecosystem
20. KreditBee / partner-lender ecosystem
21. CASHe / partner-lender ecosystem
22. Finnable
23. Kissht / partner-lender ecosystem
24. Dhani Loans & Services
25. FlexSalary / digital-lending ecosystem

### Secured / gold / broader finance companies

26. Muthoot Finance
27. Manappuram Finance
28. Muthoot FinCorp
29. IIFL Finance
30. Kosamattam Finance
31. Veritas Finance
32. Vistaar Financial Services
33. UGRO Capital
34. Five-Star Business Finance
35. Aye Finance
36. Annapurna Finance
37. Aavas Financiers
38. Aptus Value Housing Finance
39. Shriram Housing Finance / relevant current entity
40. Godrej Finance / Godrej Capital

**Note:** Some companies primarily focus on secured loans, MSME lending,
vehicle finance, housing or gold loans. They should not be automatically
classified as unsecured debt-consolidation lenders.

------------------------------------------------------------------------

# 16. NBFC Master Matrix

  ----------------------------------------------------------------------------------------------------------------
  NBFC                PL BT   Multi-PL CC Debt     App         OD   Mixed   Top-Up   Current/Headline Priority
                                                  Loan   Takeover    Debt                        Rate 
  ----------------- ------- ---------- ------- ------- ---------- ------- -------- ------------------ ------------
  **Bajaj Finance**      🟢         🟢      🟢      🟡         🟡      🟢       🟢             \~10%+ ⭐⭐⭐⭐⭐

  **Tata Capital**       🟢         🟢      🟡      🟡         🟡      🟡       🟢          \~10.99%+ ⭐⭐⭐⭐⭐

  **Shriram              🟢         🟢   🟢/🟡      🟡         🔴      🟡       🟡             \~11%+ ⭐⭐⭐⭐
  Finance**                                                                                           

  **L&T Finance**        🟢         🟢      🟡      🟡         🔴      🟡       🟢      \~10.50--11%+ ⭐⭐⭐⭐

  **IndusInd Bank**      🟢         🟢   🟢/🟡      🟡         🔴   🟢/🟡    🟢/🟡          \~10.49%+ ⭐⭐⭐⭐⭐

  **Aditya Birla         🟡         🟡      🟡      🟡         🟡      🟡       🟡          \~10.99%+ ⭐⭐⭐
  Finance**                                                                                           

  **Poonawalla           🟡         🟡      🟡      🟡         🔴      🟡       🟡           \~9.99%+ ⭐⭐⭐
  Fincorp**                                                                                           

  **Piramal              🟡         🟡      🟡      🟡         🔴      🟡       🟡             \~12%+ ⭐⭐⭐
  Finance**                                                                                           

  **Cholamandalam        🟡         🟡      🟡      🟡      🔴/🟡      🟡       🟡         \~10--14%+ ⭐⭐⭐
  Finance**                                                                                           

  **Mahindra             🟡         🟡      🟡      🟡         🔴      🟡       🟡      8--25% policy ⭐⭐
  Finance**                                                                                     range 

  **HDB Financial        🟡         🟡      🟡      🟡         🔴      🟡       🟡             \~10%+ ⭐⭐⭐
  Services**                                                                                          

  **IIFL Finance**       🟡         🟡      🟡      🟡         🔴      🟡       🟡             \~12%+ ⭐⭐⭐

  **Hero FinCorp**       🟡         🟡      🟡      🟡         🔴      🟡       🟡        Up to \~30% ⭐⭐

  **SMFG India           🟡         🟡      🟡      🟡         🔴      🟡       🟡             \~12%+ ⭐⭐
  Credit /                                                                                            
  Fullerton**                                                                                         

  **Dhani Loans &        🟡         🟡      🟡      🟡         🔴      🟡       🟡             \~14%+ ⭐⭐
  Services**                                                                                          

  **Muthoot              🟡         🟡   🔴/🟡      🟡         🔴   🔴/🟡       🟡           \~13.5%+ ⭐⭐
  Finance**                                                                                           

  **Manappuram           🟡         🟡      🟡      🟡         🔴   🔴/🟡    🟢/🟡  varies by product ⭐⭐
  Finance**                                                                                           

  **Navi Finserv**       🟡         🟡      🟡      🟡         🔴      🟡       🟡       Policy based ⭐⭐

  **DMI Finance**        🟡         🟡      🟡      🟡         🔴      🟡       🟡       Policy based ⭐⭐

  **Clix Capital**       🟡         🟡      🟡      🟡         🔴      🟡       🟡       Policy based ⭐⭐

  **Fibe**               🟡         🟡      🟡      🟡         🔴      🟡       🟡       Policy based ⭐⭐

  **KreditBee            🟡         🟡      🟡      🟡         🔴      🟡       🟡     Policy/partner ⭐
  ecosystem**                                                                                   based 

  **Moneyview            🟡         🟡      🟡      🟡         🔴      🟡       🟡     Policy/partner ⭐
  ecosystem**                                                                                   based 

  **CASHe                🟡         🟡      🟡      🟡         🔴      🟡       🟡     Policy/partner ⭐
  ecosystem**                                                                                   based 

  **Kissht               🟡         🟡      🟡      🟡         🔴      🟡       🟡     Policy/partner ⭐
  ecosystem**                                                                                   based 
  ----------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 17. Bajaj Finance --- Priority Lender

Bajaj Finance is one of the most important lenders to investigate for
Credit Expert India's debt-consolidation business.

Its debt-consolidation material explicitly positions personal loans as a
way to consolidate existing debts, including multiple loans and
credit-card dues.

### Recommended classification

  Liability              Status
  ---------------------- --------
  PL → PL                🟢
  Multiple PL            🟢
  Credit-card debt       🟢
  App loan               🟡
  OD                     🟡
  Mixed unsecured debt   🟢
  Top-up                 🟢

### Ideal customer

-   Multiple unsecured loans
-   Credit-card-heavy borrower
-   Good-to-strong CIBIL
-   Stable income
-   High EMI burden
-   Wants one EMI
-   Wants additional top-up if eligible

### Do not assume

`App loan → Bajaj PL = automatic approval`

Digital/app loans should be checked individually.

------------------------------------------------------------------------

# 18. Tata Capital

Tata Capital explicitly markets personal-loan balance transfer.

### Strong use cases

-   Existing PL
-   Multiple PLs
-   PL BT + top-up
-   Customers seeking a larger established NBFC

### Classification

  Liability     Status
  ------------- --------
  PL → PL       🟢
  Multiple PL   🟢
  Credit card   🟡
  App loan      🟡
  OD            🟡
  Mixed debt    🟡
  Top-up        🟢

Tata Capital also offers a personal hybrid/OD-style facility, but:

> **A lender offering a new OD-style product does not prove that it will
> take over an existing OD.**

Keep `OD_TAKEOVER` separate.

------------------------------------------------------------------------

# 19. Shriram Finance

Shriram's debt-consolidation material describes using a personal loan to
consolidate existing debts, including credit-card dues and older loans.

### Classification

  Liability          Status
  ------------------ --------
  PL → PL            🟢
  Multiple PL        🟢
  Credit-card debt   🟢/🟡
  App loan           🟡
  OD                 🔴
  Mixed debt         🟡
  Top-up             🟡

### Important OD note

Current industry discussion indicates revolving products are a
relatively small portion of the NBFC sector. Do not assume that a normal
personal loan or credit line means existing OD takeover is supported.

------------------------------------------------------------------------

# 20. L&T Finance

L&T Finance's personal-loan balance-transfer material explicitly
describes transferring an existing personal loan and consolidating
multiple loans into a single EMI.

### Classification

  Liability     Status
  ------------- --------
  PL → PL       🟢
  Multiple PL   🟢
  Credit card   🟡
  App loan      🟡
  OD            🔴
  Mixed debt    🟡
  Top-up        🟢

------------------------------------------------------------------------

# 21. Aditya Birla Finance

ABFL is an important lender to keep in the network, but the public
evidence is not sufficient to mark every liability category as "yes".

### Working classification

  Liability     Status
  ------------- --------
  PL → PL       🟡
  Multiple PL   🟡
  Credit card   🟡
  App loan      🟡
  OD            🟡
  Mixed debt    🟡
  Top-up        🟡

### Rule

Do not advertise:

> "ABFL accepts all loans."

Use:

> "Subject to current lender policy."

------------------------------------------------------------------------

# 22. Poonawalla Fincorp

Useful as a secondary unsecured/consumer lender.

### Working classification

  Liability     Status
  ------------- --------
  PL BT         🟡
  Multiple PL   🟡
  Credit card   🟡
  App loan      🟡
  OD            🔴
  Mixed         🟡
  Top-up        🟡

Use after checking current eligibility/channel policy.

------------------------------------------------------------------------

# 23. Piramal Finance

Piramal should be maintained in the network because it is a major retail
NBFC, but unsecured debt-consolidation acceptance should not be inferred
from the existence of a personal-loan product.

### Working classification

  Liability     Status
  ------------- --------
  PL BT         🟡
  Multiple PL   🟡
  CC            🟡
  App loan      🟡
  OD            🔴
  Mixed         🟡
  Top-up        🟡

------------------------------------------------------------------------

# 24. Cholamandalam Finance

Chola is a large diversified NBFC.

Do not automatically classify its vehicle/MSME/consumer products as
unsecured personal-loan debt consolidation.

### Working classification

  Liability     Status
  ------------- --------
  PL BT         🟡
  Multiple PL   🟡
  CC            🟡
  App loan      🟡
  OD            🔴/🟡
  Mixed         🟡
  Top-up        🟡

------------------------------------------------------------------------

# 25. Mahindra Finance

Mahindra Finance publishes a broad personal/consumer lending rate
policy, but this should not be interpreted as proof of unsecured
mixed-debt takeover.

### Working classification

  Liability     Status
  ------------- --------
  PL BT         🟡
  Multiple PL   🟡
  CC            🟡
  App loan      🟡
  OD            🔴
  Mixed         🟡
  Top-up        🟡

------------------------------------------------------------------------

# 26. Muthoot Finance

Muthoot is primarily famous for gold lending and other secured/retail
finance products.

Do **not** classify:

> Gold-loan product = personal-loan debt consolidation.

### Working classification

  Liability     Status
  ------------- --------
  PL BT         🟡
  Multiple PL   🟡
  CC            🔴/🟡
  App loan      🟡
  OD            🔴
  Mixed         🔴/🟡
  Top-up        🟡

------------------------------------------------------------------------

# 27. Manappuram Finance

Manappuram is also strongly associated with gold/secured lending.

A balance-transfer rate shown for a housing/property product should not
be used as the minimum unsecured personal-loan consolidation rate.

### Working classification

  Liability     Status
  ------------- --------
  PL BT         🟡
  Multiple PL   🟡
  CC            🟡
  App loan      🟡
  OD            🔴
  Mixed         🔴/🟡
  Top-up        🟢/🟡

------------------------------------------------------------------------

# 28. Minimum ROI Database

## Current publicly observed starting/headline rates

These are **not guaranteed customer rates**.

  ------------------------------------------------------------------------
  Lender                  Approx. published starting Use carefully
                                                rate 
  --------------------- ---------------------------- ---------------------
  HDFC Bank                                  \~9.99% PL/BT headline

  ICICI Bank                                \~10.85% BT-specific current
                                                     figure

  Kotak Mahindra Bank                       \~10.99% PL/BT

  IDFC FIRST Bank                            \~9.99% BT

  IndusInd Bank                             \~10.49% Debt consolidation

  Axis Bank                                 \~9.99%+ Current offer/channel
                                                     dependent

  Federal Bank                                \~11%+ Verify

  YES Bank                                    \~11%+ Verify

  RBL Bank                                    \~14%+ Verify

  Bajaj Finance                               \~10%+ PL/debt consolidation

  Tata Capital                             \~10.99%+ PL/BT

  Shriram Finance                             \~11%+ PL

  L&T Finance                          \~10.50--11%+ PL/BT

  Aditya Birla Finance                     \~10.99%+ Verify exact case

  Poonawalla Fincorp                        \~9.99%+ Verify

  Piramal Finance                             \~12%+ Verify

  HDB Financial                               \~10%+ Verify
  Services                                           

  IIFL Finance                                \~12%+ Verify

  Muthoot Finance                          \~13.50%+ Product dependent

  Mahindra Finance               8--25% policy range Not a consolidation
                                                     quote

  Manappuram                       Product dependent Do not use secured BT
                                                     rate as PL rate

  Chola                                   \~10--14%+ Product/channel
                                                     dependent

  Hero FinCorp                           Up to \~30% Wide risk-based
                                                     pricing

  Dhani                                       \~14%+ Verify

  Fullerton/SMFG India                        \~12%+ Verify
  Credit                                             
  ------------------------------------------------------------------------

### Source discipline

For the production database, store **three separate rate fields**:

``` text
PUBLIC_MIN_ROI
BT_MIN_ROI
CUSTOMER_QUOTED_ROI
```

Never overwrite one with another.

------------------------------------------------------------------------

# 29. Debt-Type Routing Matrix

## Case A --- One existing personal loan

Example:

``` text
Existing PL = ₹5,00,000
ROI = 18%
Remaining = ₹4,20,000
```

### First lenders to check

1.  HDFC Bank
2.  ICICI Bank
3.  IDFC FIRST Bank
4.  Kotak Mahindra Bank
5.  IndusInd Bank
6.  Axis Bank
7.  Bajaj Finance
8.  Tata Capital
9.  L&T Finance
10. Shriram Finance

------------------------------------------------------------------------

# 30. Case B --- Multiple Personal Loans

Example:

``` text
PL 1 = ₹2,00,000
PL 2 = ₹1,50,000
PL 3 = ₹80,000
Total = ₹4,30,000
```

### Priority

1.  Kotak Mahindra Bank
2.  Bajaj Finance
3.  Tata Capital
4.  HDFC Bank
5.  IndusInd Bank
6.  L&T Finance
7.  Shriram Finance
8.  ICICI Bank
9.  IDFC FIRST Bank

------------------------------------------------------------------------

# 31. Case C --- Personal Loan + Credit Card

Example:

``` text
PL = ₹3,00,000
Credit Card = ₹1,20,000
```

### Priority

1.  Bajaj Finance
2.  IndusInd Bank
3.  Shriram Finance
4.  HDFC/ICICI/Axis --- policy check
5.  Tata Capital --- policy check
6.  L&T --- policy check

**Do not promise CC takeover until the lender confirms it.**

------------------------------------------------------------------------

# 32. Case D --- App Loans

Example:

``` text
App loan 1 = ₹80,000
App loan 2 = ₹55,000
App loan 3 = ₹35,000
```

Treat this as:

> **Digital unsecured debt consolidation**

Do not create a blanket rule:

``` text
APP LOAN = PERSONAL LOAN
```

Instead, store:

``` text
ORIGINAL_LENDER
ORIGINAL_PRODUCT
LOAN_ACCOUNT_NUMBER
OUTSTANDING
FORECLOSURE_AMOUNT
CURRENT_ROI
DAYS_PAST_DUE
BOUNCE_HISTORY
BUREAU_REPORTED
```

Then route to lenders whose current policy permits the liability.

------------------------------------------------------------------------

# 33. Case E --- Credit Card Heavy Customer

Example:

``` text
Card 1 = ₹1.5L
Card 2 = ₹80k
Card 3 = ₹70k
Total = ₹3L
```

This is a high-priority debt-consolidation lead.

### Important checks

-   Current outstanding
-   Minimum due
-   Total sanctioned limit
-   Utilisation %
-   Days past due
-   Revolving vs EMI conversion
-   Card issuer
-   Bureau reporting
-   Customer income
-   Existing EMI obligations
-   CIBIL/credit score

A high utilisation customer may need a very different routing strategy
from a clean PL-BT customer.

------------------------------------------------------------------------

# 34. Case F --- Personal Loan + App Loans + Credit Card

Example:

``` text
PL = ₹3L
App loans = ₹1.5L
Credit cards = ₹2L
Total = ₹6.5L
```

This is a:

> **MIXED UNSECURED DEBT**

Do not route based only on the highest outstanding.

Build a complete liability sheet first.

### Recommended first checks

1.  Bajaj Finance
2.  IndusInd Bank
3.  Shriram Finance
4.  Tata Capital
5.  Kotak
6.  HDFC
7.  ICICI
8.  IDFC FIRST
9.  L&T
10. Axis

Final lender depends heavily on bureau, income, vintage and the exact
accounts.

------------------------------------------------------------------------

# 35. Case G --- Existing Overdraft

OD is the most dangerous category to classify incorrectly.

"OD" can mean:

-   Personal overdraft
-   Business OD
-   Cash-credit facility
-   Property-backed OD
-   FD-backed OD
-   Gold-loan OD
-   Flexi personal loan
-   Revolving credit line
-   Credit-card-style revolving line
-   Loan against property OD

Therefore add:

``` text
OD_TYPE
OD_SECURITY
OD_LENDER
OD_LIMIT
OD_UTILISED
OD_OUTSTANDING
OD_PURPOSE
```

### Default rule

Unless the lender's policy specifically says otherwise:

> **Do not assume existing OD takeover.**

------------------------------------------------------------------------

# 36. Recommended Lender Ranking

## Tier A --- Strongest starting points

### Mixed / debt consolidation

-   Bajaj Finance
-   IndusInd Bank
-   Shriram Finance
-   Tata Capital

### Prime PL BT

-   HDFC Bank
-   ICICI Bank
-   Kotak Mahindra Bank
-   IDFC FIRST Bank
-   IndusInd Bank
-   Axis Bank

### Multiple PL

-   Kotak Mahindra Bank
-   Bajaj Finance
-   Tata Capital
-   HDFC Bank
-   IndusInd Bank
-   L&T Finance
-   Shriram Finance

------------------------------------------------------------------------

# 37. Tier B --- Secondary Routing

-   Federal Bank
-   YES Bank
-   RBL Bank
-   Poonawalla Fincorp
-   Piramal Finance
-   HDB Financial Services
-   IIFL Finance
-   Aditya Birla Finance
-   Chola Finance
-   Mahindra Finance
-   Hero FinCorp
-   SMFG India Credit

------------------------------------------------------------------------

# 38. Tier C --- Policy / Channel Verification

-   Bandhan Bank
-   CSB Bank
-   City Union Bank
-   DCB Bank
-   Dhanlaxmi Bank
-   Karnataka Bank
-   Karur Vysya Bank
-   Nainital Bank
-   South Indian Bank
-   Tamilnad Mercantile Bank
-   Jammu & Kashmir Bank
-   IDBI Bank
-   Navi
-   DMI Finance
-   Clix
-   Fibe
-   KreditBee ecosystem
-   Moneyview ecosystem
-   CASHe ecosystem
-   Kissht ecosystem

------------------------------------------------------------------------

# 39. Credit Expert India CRM Schema

Use this structure instead of a simple lender/product table.

``` text
LENDER_ID
LENDER_NAME
LENDER_TYPE
BANK_OR_NBFC
PRODUCT_NAME

PL_BALANCE_TRANSFER
MULTIPLE_PL_CONSOLIDATION
CREDIT_CARD_CONSOLIDATION
APP_LOAN_CONSOLIDATION
OD_TAKEOVER
MIXED_DEBT_CONSOLIDATION
TOP_UP_AVAILABLE

MIN_ROI
MAX_ROI
BT_MIN_ROI
BT_MAX_ROI

MIN_LOAN
MAX_LOAN
MIN_CIBIL
MIN_SALARY
MAX_FOIR
MIN_VINTAGE
MAX_VINTAGE

EMPLOYMENT_TYPE
SALARIED_ALLOWED
SELF_EMPLOYED_ALLOWED
BUSINESS_ALLOWED

PROCESSING_FEE
GST_ON_PROCESSING_FEE
FORECLOSURE_RULE
PREPAYMENT_RULE

DIRECT_CLOSURE_REQUIRED
NOC_REQUIRED
FORECLOSURE_LETTER_REQUIRED
BANK_STATEMENT_REQUIRED
SALARY_SLIP_REQUIRED
ITR_REQUIRED

CITY_RESTRICTION
EMPLOYER_RESTRICTION
AGE_MIN
AGE_MAX
TENURE_MIN
TENURE_MAX

POLICY_STATUS
POLICY_LAST_VERIFIED
SOURCE_URL
SOURCE_DATE
CHANNEL_CONTACT
NOTES
```

------------------------------------------------------------------------

# 40. Customer Liability Schema

Every customer should have a separate liability table.

``` text
CUSTOMER_ID
LIABILITY_ID

LENDER_NAME
PRODUCT_TYPE
PRODUCT_SUBTYPE

ORIGINAL_LOAN_AMOUNT
CURRENT_OUTSTANDING
FORECLOSURE_AMOUNT

CURRENT_ROI
EMI
REMAINING_TENURE
ORIGINAL_TENURE

SANCTIONED_LIMIT
UTILISED_LIMIT

LOAN_START_DATE
LOAN_VINTAGE

DAYS_PAST_DUE
BOUNCE_COUNT
OVERDUE_AMOUNT

BUREAU_REPORTED
SECURED_OR_UNSECURED
SECURITY_TYPE

ACCOUNT_NUMBER
```

------------------------------------------------------------------------

# 41. Routing Engine

The AI/CRM should not ask:

> "Which lender gives the lowest interest?"

It should ask:

> "Which lenders can legally/policy-wise refinance the customer's exact
> liabilities while satisfying the customer's eligibility?"

Recommended pipeline:

``` text
CUSTOMER
   ↓
COLLECT LIABILITIES
   ↓
CLASSIFY EACH LIABILITY
   ↓
CHECK BUREAU
   ↓
CHECK INCOME
   ↓
CHECK FOIR/DBR
   ↓
CHECK LOAN VINTAGE
   ↓
CHECK DPD/BOUNCE
   ↓
CHECK LENDER LIABILITY ACCEPTANCE
   ↓
CHECK LOAN AMOUNT
   ↓
CHECK ROI
   ↓
CHECK PROCESSING / FORECLOSURE COST
   ↓
RANK LENDERS
   ↓
SUBMIT BEST MATCHES
```

------------------------------------------------------------------------

# 42. Lender Ranking Formula

A useful internal score:

``` text
LENDER_SCORE =
    LIABILITY_MATCH × 30
  + CREDIT_ELIGIBILITY × 20
  + ROI_ADVANTAGE × 15
  + EMI_REDUCTION × 15
  + LOAN_AMOUNT_FIT × 10
  + PROCESSING_COST × 5
  + TOPUP_FIT × 5
```

Do not rank purely by ROI.

A 10% lender that refuses the liability is worse than a 13% lender that
can actually consolidate the customer's debt.

------------------------------------------------------------------------

# 43. Important Customer-Level Variables

Before recommending a lender, collect:

### Identity

-   Age
-   City
-   Residence vintage
-   PAN
-   Aadhaar/KYC status

### Employment

-   Salaried / self-employed
-   Employer
-   Employer category
-   Monthly net salary
-   Gross salary
-   Employment vintage
-   Job stability

### Credit

-   CIBIL score
-   Experian score if available
-   Number of active loans
-   Number of active credit cards
-   Recent enquiries
-   DPD history
-   Settled/write-off history
-   Bounce history

### Debt

-   Total outstanding
-   Total EMI
-   Credit-card outstanding
-   Credit-card minimum due
-   App-loan outstanding
-   Existing PL outstanding
-   OD utilised amount

### Requested transaction

-   Total BT amount
-   Top-up requirement
-   Desired EMI
-   Desired tenure
-   Desired ROI
-   Need for cash in hand

------------------------------------------------------------------------

# 44. Minimum Data Required Before Submission

At minimum collect:

``` text
CIBIL
MONTHLY_INCOME
EMPLOYMENT_TYPE
EMPLOYER
TOTAL_EXISTING_EMI
TOTAL_OUTSTANDING
PL_OUTSTANDING
CC_OUTSTANDING
APP_LOAN_OUTSTANDING
OD_OUTSTANDING
NUMBER_OF_ACTIVE_LOANS
NUMBER_OF_CREDIT_CARDS
DPD_STATUS
LOAN_VINTAGE
CITY
AGE
```

------------------------------------------------------------------------

# 45. Minimum ROI --- Correct Interpretation

Never display:

> "HDFC = 9.99% for customer"

Display:

> "HDFC published starting rate: 9.99%"

The actual customer rate can be higher.

The rate depends on factors including:

-   Credit score
-   Income
-   Employer
-   Existing obligations
-   Loan amount
-   Tenure
-   Customer relationship
-   Risk grade
-   Geography
-   Repayment history
-   Internal lender score
-   Existing banking relationship

------------------------------------------------------------------------

# 46. Do Not Mix These Rate Types

Store separately:

``` text
GENERAL_PL_RATE
BALANCE_TRANSFER_RATE
DEBT_CONSOLIDATION_RATE
SPECIAL_CAMPAIGN_RATE
PRE_APPROVED_RATE
CUSTOMER_FINAL_RATE
```

Example:

``` text
GENERAL_PL_RATE = 10.49%
BT_RATE = 10.99%
CUSTOMER_FINAL_RATE = 14.25%
```

These are not contradictory.

------------------------------------------------------------------------

# 47. Cost Comparison

The AI should calculate:

``` text
CURRENT_TOTAL_INTEREST
+
CURRENT_PROCESSING/FORECLOSURE_COST

versus

NEW_TOTAL_INTEREST
+
NEW_PROCESSING_FEE
+
GST
+
OTHER_CHARGES
```

Do not sell a balance transfer simply because:

> New ROI \< Old ROI

The customer could still lose money if:

-   Existing loan is almost finished
-   Foreclosure charge is high
-   New tenure is much longer
-   Processing fee is high
-   Insurance/add-ons are added
-   EMI reduction is achieved only by extending tenure

------------------------------------------------------------------------

# 48. Example

Existing:

``` text
Outstanding = ₹5,00,000
Current ROI = 18%
Remaining tenure = 36 months
```

Potential new loan:

``` text
ROI = 12%
Tenure = 60 months
```

The new EMI may be lower.

But the customer could pay more total interest because the loan is
stretched from 3 years to 5 years.

Therefore show:

``` text
OLD EMI
NEW EMI

OLD TOTAL PAYABLE
NEW TOTAL PAYABLE

INTEREST SAVING
PROCESSING FEE
FORECLOSURE FEE
NET SAVING

TENURE CHANGE
```

------------------------------------------------------------------------

# 49. Customer-Facing Positioning

For Credit Expert India, avoid:

> "We will get you the lowest interest rate."

Prefer:

> **"We compare your existing loans and identify suitable lenders for
> balance transfer or debt consolidation."**

For mixed debt:

> **"One plan for multiple debts --- subject to lender eligibility."**

For PL BT:

> **"Reduce your EMI burden or financing cost by comparing eligible
> balance-transfer options."**

For high-interest credit cards:

> **"Explore whether eligible unsecured debt can be consolidated into a
> structured EMI."**

------------------------------------------------------------------------

# 50. Recommended Website Categories

Create these service categories:

### 1. Personal Loan Balance Transfer

For:

``` text
PL → PL
```

### 2. Multiple Loan Consolidation

For:

``` text
PL + PL + PL
```

### 3. Credit Card Debt Consolidation

For:

``` text
CC + CC
CC + PL
```

### 4. App Loan Consolidation

For:

``` text
Digital loan + digital loan
App loan + PL
```

### 5. Mixed Debt Consolidation

For:

``` text
PL + CC + App Loan
```

### 6. EMI Reduction

For customers primarily looking for lower monthly outflow.

### 7. Interest Cost Reduction

For customers primarily looking to reduce total interest.

### 8. Top-Up With Balance Transfer

For customers needing:

``` text
BT amount + additional cash requirement
```

------------------------------------------------------------------------

# 51. OD Handling

Create a separate service:

> **Overdraft / Credit-Line Refinancing**

Do not combine it with normal PL BT.

Required fields:

``` text
OD_TYPE
SECURED
SECURITY_VALUE
OD_LIMIT
OD_UTILISED
CURRENT_RATE
BANK/NBFC
TENURE
PURPOSE
```

Potential OD categories:

-   Personal OD
-   Flexi PL
-   Business OD
-   Cash Credit
-   LAP OD
-   FD OD
-   Gold OD
-   Credit Line
-   Revolving Loan

------------------------------------------------------------------------

# 52. High-Priority Lender Shortlist

## If customer has clean PL

``` text
HDFC
ICICI
IDFC FIRST
Kotak
IndusInd
Axis
Bajaj
Tata
L&T
Shriram
```

## If customer has multiple PLs

``` text
Kotak
Bajaj
Tata
HDFC
IndusInd
L&T
Shriram
ICICI
IDFC FIRST
```

## If customer has PL + CC

``` text
Bajaj
IndusInd
Shriram
HDFC*
ICICI*
Kotak*
Tata*
Axis*
```

`* = policy confirmation`

## If customer has app loans

``` text
Bajaj*
IndusInd*
Shriram*
Tata*
HDFC*
ICICI*
Kotak*
IDFC FIRST*
```

`* = exact app/digital lender must be checked`

## If customer has OD

``` text
DO NOT AUTO-ROUTE
```

First identify the exact OD product.

------------------------------------------------------------------------

# 53. Master Priority Table

    Rank Lender                   Main Strength
  ------ ------------------------ -------------------------------------
       1 Bajaj Finance            Mixed unsecured debt consolidation
       2 IndusInd Bank            Explicit debt-consolidation product
       3 Kotak Mahindra Bank      Multiple-loan consolidation + PL BT
       4 HDFC Bank                Prime PL BT
       5 ICICI Bank               PL BT + top-up
       6 IDFC FIRST Bank          Competitive PL BT
       7 Tata Capital             PL BT + multiple PL
       8 Shriram Finance          Debt consolidation + CC/older debt
       9 L&T Finance              PL BT + multiple loan consolidation
      10 Axis Bank                Large private-bank PL ecosystem
      11 Poonawalla Fincorp       Secondary unsecured lender
      12 Aditya Birla Finance     Broad NBFC ecosystem
      13 HDB Financial Services   Consumer finance ecosystem
      14 Piramal Finance          Large retail NBFC
      15 Chola                    Diversified NBFC
      16 Mahindra Finance         Consumer/retail finance
      17 IIFL Finance             Diversified NBFC
      18 Federal Bank             Secondary private bank
      19 YES Bank                 Secondary private bank
      20 RBL Bank                 Secondary private bank

------------------------------------------------------------------------

# 54. Production Database Status Values

Use these exact values:

``` text
CONFIRMED
LIKELY
POLICY_CHECK
NOT_SUPPORTED
NOT_RESEARCHED
```

Do not use only:

``` text
YES
NO
```

because lender policy is dynamic and product-specific.

------------------------------------------------------------------------

# 55. Recommended Internal Record

Example:

``` json
{
  "lender": "Bajaj Finance",
  "type": "NBFC",
  "pl_bt": "CONFIRMED",
  "multiple_pl": "CONFIRMED",
  "credit_card": "CONFIRMED",
  "app_loan": "POLICY_CHECK",
  "od_takeover": "POLICY_CHECK",
  "mixed_debt": "CONFIRMED",
  "top_up": "CONFIRMED",
  "public_min_roi": "10%+",
  "customer_roi": null,
  "last_verified": "2026-09",
  "notes": "Do not assume app-loan or OD takeover."
}
```

------------------------------------------------------------------------

# 56. Verification Workflow

Before adding a lender to the "confirmed" category:

### Step 1

Find official lender page.

### Step 2

Find exact product.

### Step 3

Check whether page explicitly says:

-   Balance Transfer
-   Debt Consolidation
-   Multiple Loans
-   Credit Card Dues
-   Existing Loan Takeover

### Step 4

Check rate.

### Step 5

Check eligibility.

### Step 6

Check minimum loan amount.

### Step 7

Check whether foreclosure/NOC is required.

### Step 8

Check whether lender pays existing lender directly.

### Step 9

Confirm current channel policy.

### Step 10

Record verification date.

------------------------------------------------------------------------

# 57. Sources and Research Notes

The private-sector bank universe is based on the Department of Financial
Services' private-sector-bank listing. citeturn0search0

Current market-rate comparison sources show substantial differences
among lenders and emphasize that advertised starting rates are not
necessarily the rate received by every borrower.
citeturn0search1turn0search4

IndusInd Bank currently has an explicit personal-loan debt-consolidation
page describing the ability to merge multiple debts into one repayment
and advertising rates starting around 10.49%. citeturn0search3

Kotak Mahindra Bank publishes material explaining personal-loan balance
transfer and how it can move existing loans to a new lender.
citeturn0search5

A current debt-consolidation comparison also shows a broad set of banks
and NBFCs offering or advertising debt-consolidation products, but
third-party comparison rates should be treated as a research reference
rather than final lender policy. citeturn0search2

Recent industry reporting also highlights that revolving loans/credit
lines are a relatively small part of NBFC lending, reinforcing the need
to treat OD/revolving-credit takeover as a separate policy question
rather than assuming it is part of normal PL BT. citeturn0news24

------------------------------------------------------------------------

# 58. Final Operating Rule for Credit Expert India

### Never route by:

``` text
"Lender offers personal loan."
```

### Route by:

``` text
Customer liability
        ↓
Exact product type
        ↓
Takeover eligibility
        ↓
Customer credit profile
        ↓
Income / FOIR
        ↓
Loan amount
        ↓
Tenure
        ↓
ROI
        ↓
Processing + foreclosure cost
        ↓
Net benefit
```

### The goal is not:

> **Find the lowest advertised ROI.**

### The goal is:

> **Find the best eligible lender that can actually consolidate the
> customer's liabilities at a lower overall cost and/or manageable
> EMI.**

------------------------------------------------------------------------

# 59. Recommended Next Database Expansion

For a production-grade Credit Expert India lender engine, the next
version should add:

``` text
50+ lenders
100+ products
State/city availability
Minimum CIBIL
Minimum salary
Maximum FOIR
Employment category
Employer list/category
Loan vintage
DPD tolerance
Bounce tolerance
Maximum enquiries
Credit-card utilisation tolerance
Maximum loan amount
Minimum loan amount
BT minimum outstanding
Top-up rules
Direct closure rules
NOC rules
Processing fee
Foreclosure fee
Insurance
Stamp duty
Tenure
ROI slabs
Channel-specific ROI
Salaried policy
Self-employed policy
Business-owner policy
```

The resulting database can then power an automated:

> **"Best Lender for This Customer"**

engine inside Credit Expert India.