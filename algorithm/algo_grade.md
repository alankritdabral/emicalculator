Yes — if by “every single one” you mean you want the actual company-name database, not descriptions such as “large listed companies” or “regional companies,” then we should build it as a proper master list.

One important distinction: it is not possible to literally enumerate every Indian employer in A/B/C because India has millions of registered entities, and the universe changes constantly. For your Credit Expert India model, the sensible approach is to create a large named whitelist/master database and then use rules for companies not explicitly listed.

The 2025 Fortune India 500 alone contains 500 major companies, while the broader Indian corporate universe is much larger.

I would structure your master list like this

A+ — highest employer stability

TCS
Infosys
HCLTech
Wipro
Accenture
IBM India
Microsoft India
Google India
Amazon India
Apple India
Deloitte
EY
KPMG
PwC
Reliance Industries
Tata Consultancy Services
Tata Motors
Tata Steel
Tata Consumer Products
Titan Company
Tata Power
Tata Communications
Tata Electronics
Tata Capital
Tata AIG
Tata Advanced Systems
Tata Technologies
Larsen & Toubro
LTIMindtree
L&T Technology Services
Reliance Jio
Reliance Retail
Aditya Birla Group
Hindalco Industries
UltraTech Cement
Grasim Industries
Aditya Birla Capital
Aditya Birla Fashion
Vodafone Idea
Mahindra & Mahindra
Tech Mahindra
Mahindra Finance
Mahindra Logistics
Mahindra Lifespaces
Mahindra & Mahindra Financial Services
ONGC
Indian Oil Corporation
Bharat Petroleum
Hindustan Petroleum
GAIL
Coal India
NTPC
Power Grid Corporation of India
BHEL
SAIL
HAL
BEL
BEML
NMDC
NLC India
Oil India
Engineers India
Power Finance Corporation
REC
Indian Railway
State Bank of India
Bank of Baroda
Punjab National Bank
Canara Bank
Union Bank of India
Bank of India
Indian Bank
Central Bank of India
Indian Overseas Bank
Bank of Maharashtra
UCO Bank
Punjab & Sind Bank
LIC
NABARD
EXIM Bank
SIDBI

These are consistent with the type of companies appearing at the very top of India's major-company rankings; for example, Fortune India's 2025 ranking has Reliance, LIC, IOC, SBI and ONGC in the top five and includes companies such as Tata Steel, NTPC, Bharti Airtel, JSW Steel, PNB, Bajaj Finserv and HCLTech among the major employers.

A — I would then expand this to hundreds of named companies

For example:

Banks

HDFC Bank
ICICI Bank
Axis Bank
Kotak Mahindra Bank
IndusInd Bank
IDFC First Bank
Yes Bank
Federal Bank
RBL Bank
Bandhan Bank
South Indian Bank
City Union Bank
Karur Vysya Bank
Karnataka Bank
DCB Bank
CSB Bank
Tamilnad Mercantile Bank
Jammu & Kashmir Bank
AU Small Finance Bank
Ujjivan Small Finance Bank
Equitas Small Finance Bank
Jana Small Finance Bank
ESAF Small Finance Bank
Suryoday Small Finance Bank
Utkarsh Small Finance Bank

NBFC / Finance

Bajaj Finance
Bajaj Finserv
Shriram Finance
Cholamandalam Investment & Finance
Muthoot Finance
Manappuram Finance
L&T Finance
Tata Capital
Mahindra Finance
Aditya Birla Finance
HDB Financial Services
Sundaram Finance
Poonawalla Fincorp
LIC Housing Finance
Can Fin Homes
PFC
REC
IIFL Finance
Five-Star Business Finance
Aptus Value Housing Finance
Aavas Financiers
Home First Finance
CreditAccess Grameen
Ugro Capital

IT / Software

Tech Mahindra
LTIMindtree
Mphasis
Coforge
Persistent Systems
Hexaware Technologies
KPIT Technologies
Mastek
Cyient
Birlasoft
Sonata Software
Zensar Technologies
Happiest Minds
Newgen Software
Oracle India
SAP India
Cisco India
Adobe India
Salesforce India
Dell Technologies India
Hewlett Packard Enterprise India
Capgemini India
Cognizant India
Genpact
WNS
EXL
Concentrix
Teleperformance India

Automobile

Maruti Suzuki
Hyundai Motor India
Tata Motors
Mahindra & Mahindra
Toyota Kirloskar Motor
Honda Cars India
Honda Motorcycle & Scooter India
Hero MotoCorp
Bajaj Auto
TVS Motor
Eicher Motors
Ashok Leyland
Force Motors
Renault India
Kia India
MG Motor India
Isuzu Motors India
Volkswagen India
Skoda Auto India
Daimler India Commercial Vehicles
Volvo Eicher Commercial Vehicles

Pharma

Sun Pharma
Dr. Reddy's Laboratories
Cipla
Lupin
Aurobindo Pharma
Zydus Lifesciences
Torrent Pharmaceuticals
Alkem Laboratories
Biocon
Glenmark Pharmaceuticals
Divi's Laboratories
Abbott India
Mankind Pharma
Alembic Pharmaceuticals
Ipca Laboratories
Laurus Labs
Natco Pharma
Granules India
Ajanta Pharma
Piramal Pharma

FMCG / Consumer

Hindustan Unilever
ITC
Nestlé India
Britannia Industries
Dabur India
Marico
Godrej Consumer Products
Tata Consumer Products
Colgate-Palmolive India
Procter & Gamble India
Reckitt India
Emami
Patanjali Foods
Varun Beverages
United Breweries
United Spirits
Asian Paints
Berger Paints
Kansai Nerolac
Pidilite Industries

Telecom

Reliance Jio
Bharti Airtel
Vodafone Idea
Tata Communications
Tata Teleservices
RailTel
Indus Towers

Infrastructure / Construction

Larsen & Toubro
Adani Enterprises
Adani Ports
Adani Power
Adani Energy Solutions
Adani Green Energy
Adani Total Gas
Shapoorji Pallonji
NCC
KNR Constructions
Dilip Buildcon
Ashoka Buildcon
IRB Infrastructure
GMR Airports
G R Infraprojects
Kalpataru Projects
KEC International
RVNL
IRCON
NBCC

Steel / Metals / Mining

Tata Steel
JSW Steel
JSW Energy
Hindalco
Vedanta
NMDC
SAIL
Jindal Steel & Power
Jindal Stainless
Hindustan Zinc
MOIL
NALCO
National Mineral Development Corporation
Rashtriya Ispat Nigam

And so on.

But I think you actually want something bigger

For your eligibility calculator, I would not stop at 100–200 companies.

I'd build:

Tier	Database
A+	~300–500 named employers
A	~1,000–2,000 named employers
B	~3,000–10,000 named employers
C	Rule-based rather than manually enumerated
Unknown	Any employer not found in database

That gives you a much more robust system.

Also, don't hard-code “C” merely because a company isn't famous. A small but stable company can be a perfectly good employer. Your scoring should combine:

Employer Tier + Company Size + Employment Vintage + Salary + CIBIL + FOIR + Existing Obligations + Geography

rather than using company name alone.

If you want, I can next produce the actual 1,000+ company master list in Markdown/CSV format, with:

Company Name | Group | Industry | Tier | Public/Private | PSU/Private | Employer Size | Confidence

so you can directly put it into your Credit Expert India eligibility engine.

how to get

A+	~300–500 named employers
A	~1,000–2,000 named employers
B	~3,000–10,000 named employers?

Yes. If your goal is to build a usable employer-grade database for Credit Expert India, I would not manually search for 10,000 companies one by one.

Instead, build the database from several authoritative company universes and then apply your grading rules.

1. Start with the biggest companies

The easiest foundation is the Fortune India 500. The 2025 list contains 500 large Indian companies and includes revenue, employees, industry, assets, debt, etc.

This alone can give you roughly:

Source	Approx. companies	Use
Fortune India 500	500	A+ / A
NSE/BSE listed companies	Thousands	A / B
Banks	~100+	Mostly A+/A
RBI-regulated NBFCs	Thousands	A/B/C based on size
PSUs/CPSEs	Hundreds	Mostly A+/A
Major MNCs in India	Hundreds	A+/A
Hospitals	Hundreds	A/B
Universities/education groups	Hundreds	A/B
Regional employers	Thousands	B
Startups	Thousands	B/C

So you can realistically construct a 10,000+ employer database without trying to enumerate every company registered in India.

2. The important part: don't make A+/A/B manually

Instead, create a scoring engine.

For example:

Employer Score =

Company Size              30%
Financial Strength        20%
Employment Stability      20%
Corporate Reputation      10%
Age of Company            10%
Industry Stability        10%

Then automatically convert the score into:

90–100 → A+
75–89  → A
55–74  → B
<55    → C

This is much better for your loan eligibility system.

3. Build the A+ database first

Your A+ database should be around 300–500 companies.

You can obtain these mostly from:

A. Fortune India 500

Take approximately the top 150–250 companies based on:

Revenue
Employees
Assets
Profitability
Market capitalization
Corporate longevity

For example, the 2025 Fortune list starts with Reliance, LIC, Indian Oil, SBI, ONGC, HDFC Bank, Tata Motors, BPCL, ICICI Bank and L&T.

B. Major IT companies

Add:

TCS
Infosys
HCLTech
Wipro
Tech Mahindra
LTIMindtree
Mphasis
Coforge
Persistent Systems
Oracle India
Microsoft India
Google India
Amazon India
Apple India
IBM India
Cisco India
SAP India
Adobe India
Salesforce India
Accenture
Capgemini
Cognizant
Deloitte
EY
KPMG
PwC
Genpact
WNS
EXL
C. Major government employers

Add:

Indian Railways
Indian Army
Indian Navy
Indian Air Force
DRDO
ISRO
LIC
SBI
RBI
NABARD
SIDBI
EXIM Bank

and major CPSEs such as:

ONGC
Indian Oil
BPCL
HPCL
GAIL
NTPC
Coal India
Power Grid
BHEL
SAIL
HAL
BEL
BEML
NMDC
NALCO
Oil India
PFC
REC
RVNL
IRCON
NBCC

The large PSU universe is particularly useful because employment stability is generally high.

4. Then create your A database

Target:

1,000–2,000 employers

Start with the remaining Fortune 500 companies.

Then add:

Private banks
HDFC Bank
ICICI Bank
Axis Bank
Kotak Mahindra Bank
IndusInd Bank
IDFC First Bank
Yes Bank
Federal Bank
RBL Bank
Bandhan Bank
South Indian Bank
Karur Vysya Bank
City Union Bank
DCB Bank
CSB Bank
Jammu & Kashmir Bank
Tamilnad Mercantile Bank
Karnataka Bank
NBFCs
Bajaj Finance
Bajaj Finserv
Shriram Finance
Cholamandalam Investment
Mahindra Finance
Tata Capital
Aditya Birla Finance
L&T Finance
HDB Financial Services
Muthoot Finance
Muthoot Fincorp
Manappuram Finance
Sundaram Finance
Poonawalla Fincorp
IIFL Finance
Five-Star Business Finance
Aavas Financiers
Home First Finance
Aptus Value Housing
CreditAccess Grameen
Ugro Capital
Pharma
Sun Pharma
Dr Reddy's
Cipla
Lupin
Aurobindo Pharma
Zydus Lifesciences
Torrent Pharma
Alkem Laboratories
Biocon
Glenmark
Divi's Laboratories
Abbott India
Mankind Pharma
Piramal Pharma
Ipca Laboratories
Natco Pharma
Laurus Labs
Ajanta Pharma
Automobile
Maruti Suzuki
Tata Motors
Mahindra & Mahindra
Hyundai Motor India
Toyota Kirloskar
Honda Cars India
Hero MotoCorp
Bajaj Auto
TVS Motor
Eicher Motors
Ashok Leyland
Force Motors
Kia India
MG Motor India
Volkswagen India
Skoda Auto India

And continue this across:

FMCG
Retail
Telecom
Energy
Chemicals
Steel
Cement
Infrastructure
Logistics
Aviation
Hospitals
IT
BPO
E-commerce
Insurance
Media
Education
5. B is where you get your 3,000–10,000 companies

This is where I would stop manually creating lists.

Instead, take a large company universe and calculate the grade.

For example:

Company
   ↓
Is it a real/active employer?
   ↓
Number of employees
   ↓
Company age
   ↓
Revenue
   ↓
Profitability
   ↓
Listed/unlisted
   ↓
Industry
   ↓
Ownership
   ↓
Financial stability
   ↓
Employer score
   ↓
A+ / A / B / C

For example:

Company 1
Employees: 25,000
Age: 30 years
Revenue: ₹10,000 Cr
Listed: Yes
Industry: Manufacturing

Score = 87

Grade = A
Company 2
Employees: 600
Age: 12 years
Revenue: ₹500 Cr
Listed: No
Industry: IT

Score = 68

Grade = B
Company 3
Employees: 35
Age: 2 years
Revenue: ₹5 Cr
Listed: No
Industry: Services

Score = 38

Grade = C
6. This is the database structure I recommend

Don't just store:

Company → A+

Store something like:

company_id
company_name
normalized_name
parent_group
industry
sub_industry
ownership_type
listed_status
cin
pan
gstin
employee_count
annual_revenue
company_age
city
state
number_of_locations
company_status
employer_tier
employer_score
data_source
last_verified

Example:

{
  "company_name": "Tata Consultancy Services",
  "parent_group": "Tata Group",
  "industry": "IT Services",
  "ownership": "Private",
  "listed": true,
  "employee_count": 600000,
  "employer_score": 98,
  "employer_tier": "A+"
}
7. Most important: don't call this a "CIBIL grade"

This is important for your Credit Expert India product.

CIBIL does not give employees/company names an official A+/A/B/C employer grade.

So don't tell the customer:

"TCS is A+ according to CIBIL."

Instead say:

Employer Stability Tier: A+

or:

Employer Profile: A+

Then your internal underwriting model can use that value.

8. Where I would get the actual data

I'd build your master database from approximately these sources:

                    MASTER DATABASE
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
     Fortune 500       NSE/BSE          Government
          │                │                │
          ↓                ↓                ↓
       A+/A             A/B             A+/A
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                    RBI REGULATED ENTITIES
                           ↓
                       Banks/NBFC
                           ↓
                    A+/A/B/C
                           ↓
                 MNC + Regional Companies
                           ↓
                         B/C

The Fortune 500 is particularly useful because it already provides employees, revenue, assets, debt, profitability and industry rather than merely company names.

9. The better target for your website

I wouldn't actually aim for:

A+ = 300–500
A  = 1,000–2,000
B  = 3,000–10,000

I'd build:

A+  → 500
A   → 2,000
B   → 7,500
C   → RULE-BASED
-----------------
TOTAL → 10,000+

And C should not be a fixed list.

For example:

IF company exists
AND company is active
AND employee_count < 100
AND no strong financial/reputation indicators
THEN C

That way, if someone enters:

"ABC Technologies Pvt Ltd"

and it isn't in your database, your system doesn't simply say:

❌ Company not found

Instead:

Company found
       ↓
Not in premium employer database
       ↓
Evaluate available company information
       ↓
Calculate employer score
       ↓
B / C

That is much more scalable.

For Credit Expert India, I'd therefore build two systems

1. Employer Master List

10,000–20,000 known employers

2. Employer Scoring Engine

Any unknown employer
       ↓
Evaluate
       ↓
Generate score
       ↓
A+ / A / B / C

This means you don't need to maintain a manually curated list of every Indian company.