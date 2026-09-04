document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emi-form');
    const resultsSection = document.getElementById('results');

    // Inputs
    const loanAmountInput = document.getElementById('loan-amount');
    const loanIssueDateInput = document.getElementById('loan-issue-date');
    const interestRateInput = document.getElementById('interest-rate');
    const tenureInput = document.getElementById('tenure');
    const tenureUnitLabel = document.getElementById('tenure-unit-label');
    const tenureUnitButtons = document.querySelectorAll('#tenure-unit-switch .unit-btn');
    const dateRuleBadge = document.getElementById('date-rule-badge');
    const dateRuleText = document.getElementById('date-rule-text');
    
    // Result displays - Timeline & Outstanding Hero
    const displayIssueDate = document.getElementById('display-issue-date');
    const displayFirstEmiDate = document.getElementById('display-first-emi-date');
    const displayEmiProgressCount = document.getElementById('display-emi-progress-count');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressPercentLabel = document.getElementById('progress-percent-label');
    const remainingEmisLabel = document.getElementById('remaining-emis-label');
    const displayOutstandingAmount = document.getElementById('display-outstanding-amount');
    const displayMonthlyPayment = document.getElementById('display-monthly-payment');
    const displayTotalInterest = document.getElementById('display-total-interest');
    const displayTotalRepayment = document.getElementById('display-total-repayment');
    const asOfBadge = document.getElementById('as-of-badge');

    // Offer displays
    const offerRateTitle = document.getElementById('offer-rate-title');
    const resultOfferRateInput = document.getElementById('result-offer-rate');
    const resultOfferMonthsInput = document.getElementById('result-offer-months');
    const tenureConversionBadge = document.getElementById('tenure-conversion-badge');
    const offerTenurePill = document.getElementById('offer-tenure-pill');
    const offerCalculatedPrincipal = document.getElementById('offer-calculated-principal');
    const emi999Display = document.getElementById('emi-999');
    const offerTotalInterestDisplay = document.getElementById('offer-total-interest');
    const offerTotalDisplay = document.getElementById('offer-total-payment');
    
    // Difference displays
    const emiDiffDisplay = document.getElementById('emi-diff');
    const monthlyDiffLabel = document.getElementById('monthly-diff-label');
    const yearDiffDisplay = document.getElementById('year-diff');
    const yearlyDiffLabel = document.getElementById('yearly-diff-label');
    const totalDiffDisplay = document.getElementById('total-diff');

    let tenureUnit = 'months'; // 'months' or 'years'
    let currentOfferMonths = 36;

    // Set default loan issue date to roughly 12 months ago
    const setDefaultIssueDate = () => {
        const today = new Date();
        const defaultDate = new Date(today.getFullYear() - 1, today.getMonth(), 15);
        const yyyy = defaultDate.getFullYear();
        const mm = String(defaultDate.getMonth() + 1).padStart(2, '0');
        const dd = String(defaultDate.getDate()).padStart(2, '0');
        loanIssueDateInput.value = `${yyyy}-${mm}-${dd}`;
        updateDateRulePreview();
    };

    // Currency Formatter
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Math.round(amount));
    };

    // Format Compact Lakh for stat badges (e.g. ₹4.1L, ₹14.1L)
    const formatCompactLakh = (amount) => {
        if (!amount || isNaN(amount) || amount <= 0) return '₹0';
        if (amount >= 100000) {
            const inLakhs = (amount / 100000).toFixed(1).replace(/\.0$/, '');
            return `₹${inLakhs}L`;
        }
        return formatCurrency(amount);
    };

    // Format Date for Clean Display (e.g. "15 Jan 2024")
    const formatDateDisplay = (dateObj) => {
        if (!dateObj || isNaN(dateObj.getTime())) return '-';
        return dateObj.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format Month & Year for EMI Start (e.g. "Feb 2024")
    const formatMonthYearDisplay = (dateObj) => {
        if (!dateObj || isNaN(dateObj.getTime())) return '-';
        return dateObj.toLocaleDateString('en-IN', {
            month: 'short',
            year: 'numeric'
        });
    };

    // Calculate First EMI Date based on the 21st cutoff rule
    // Rule:
    // If loan issued day <= 21 -> 1st EMI starts next month (M + 1)
    // If loan issued day > 21  -> 1st EMI starts next to next month (M + 2)
    const getFirstEMIDate = (issueDate) => {
        if (!issueDate || isNaN(issueDate.getTime())) return null;

        const day = issueDate.getDate();
        const firstEmiDate = new Date(issueDate.getFullYear(), issueDate.getMonth(), 5); // Standard EMI due day: 5th

        if (day <= 21) {
            firstEmiDate.setMonth(firstEmiDate.getMonth() + 1);
        } else {
            firstEmiDate.setMonth(firstEmiDate.getMonth() + 2);
        }

        return firstEmiDate;
    };

    // Update the live hint badge below the issue date input
    const updateDateRulePreview = () => {
        const val = loanIssueDateInput.value;
        if (!val) {
            dateRuleText.textContent = 'Issued on or before 21st → 1st EMI next month | Issued after 21st → 1st EMI month after next';
            return;
        }

        const [y, m, d] = val.split('-').map(Number);
        const issueDate = new Date(y, m - 1, d);
        const firstEmiDate = getFirstEMIDate(issueDate);

        if (d <= 21) {
            dateRuleText.innerHTML = `Disbursed on <strong>${d} ${issueDate.toLocaleDateString('en-IN', { month: 'short' })}</strong> (≤ 21st) ➔ 1st EMI starts next month in <strong>${formatMonthYearDisplay(firstEmiDate)}</strong>`;
            dateRuleBadge.classList.remove('after-21');
            dateRuleBadge.classList.add('before-21');
        } else {
            dateRuleText.innerHTML = `Disbursed on <strong>${d} ${issueDate.toLocaleDateString('en-IN', { month: 'short' })}</strong> (&gt; 21st) ➔ 1st EMI starts month after next in <strong>${formatMonthYearDisplay(firstEmiDate)}</strong>`;
            dateRuleBadge.classList.remove('before-21');
            dateRuleBadge.classList.add('after-21');
        }
    };

    // Calculate elapsed EMIs up to As-Of date (Today)
    const calculateElapsedEMIs = (firstEmiDate, totalMonths) => {
        if (!firstEmiDate) return 0;
        const today = new Date();

        // If 1st EMI is in future
        if (today < firstEmiDate) {
            return 0;
        }

        // Calculate months elapsed
        const yearDiff = today.getFullYear() - firstEmiDate.getFullYear();
        const monthDiff = today.getMonth() - firstEmiDate.getMonth();
        let elapsed = yearDiff * 12 + monthDiff;

        // If today's date has passed the EMI due day (5th) of current month, count this month's installment
        if (today.getDate() >= 5) {
            elapsed += 1;
        }

        return Math.max(0, Math.min(totalMonths, elapsed));
    };

    // Calculate Standard EMI
    const calculateEMI = (principal, annualRate, months) => {
        if (!principal || principal <= 0 || !months || months <= 0) return 0;
        if (annualRate === 0) return principal / months;

        const r = annualRate / (12 * 100); // monthly interest rate
        const n = months;
        
        // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
        const numerator = principal * r * Math.pow(1 + r, n);
        const denominator = Math.pow(1 + r, n) - 1;
        
        return numerator / denominator;
    };

    // Calculate Amortized Outstanding Balance and Repayment Stats
    const calculateAmortization = (principal, annualRate, totalMonths, elapsedMonths) => {
        const monthlyEmi = calculateEMI(principal, annualRate, totalMonths);
        const r = annualRate / (12 * 100);

        let balance = principal;
        let principalPaidSoFar = 0;
        let interestPaidSoFar = 0;

        for (let i = 1; i <= elapsedMonths; i++) {
            const interestForMonth = balance * r;
            const principalForMonth = Math.min(balance, monthlyEmi - interestForMonth);

            balance -= principalForMonth;
            principalPaidSoFar += principalForMonth;
            interestPaidSoFar += interestForMonth;
        }

        const outstandingBalance = Math.max(0, balance);
        const remainingMonths = Math.max(0, totalMonths - elapsedMonths);

        return {
            monthlyEmi,
            outstandingBalance,
            principalPaidSoFar,
            interestPaidSoFar,
            totalPaidSoFar: principalPaidSoFar + interestPaidSoFar,
            remainingMonths
        };
    };

    // Tenure Unit Switcher (Mo / Yr)
    tenureUnitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const unit = btn.dataset.unit;
            if (unit === tenureUnit) return;

            tenureUnitButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tenureUnit = unit;
            tenureUnitLabel.textContent = unit === 'months' ? 'Mo' : 'Yr';

            const currentValue = parseFloat(tenureInput.value);
            if (!isNaN(currentValue) && currentValue > 0) {
                if (unit === 'years') {
                    tenureInput.value = (currentValue / 12).toFixed(1).replace(/\.0$/, '');
                    tenureInput.placeholder = '3';
                } else {
                    tenureInput.value = Math.round(currentValue * 12);
                    tenureInput.placeholder = '36';
                }
            } else {
                tenureInput.placeholder = unit === 'months' ? '36' : '3';
            }

            if (!resultsSection.classList.contains('hidden')) {
                performCalculation(true);
            }
        });
    });

    // Live Offer Interest Rate Input
    if (resultOfferRateInput) {
        resultOfferRateInput.addEventListener('input', () => {
            performCalculation(false);
        });
    }

    // Live Custom Offer Months Input
    if (resultOfferMonthsInput) {
        resultOfferMonthsInput.addEventListener('input', () => {
            const val = parseInt(resultOfferMonthsInput.value, 10);
            if (!isNaN(val) && val > 0) {
                currentOfferMonths = val;
                performCalculation(false);
            }
        });
    }

    // Perform Full Calculation and UI Update
    // syncWithRemaining: when true, defaults Refinance Tenure directly to remaining months left
    const performCalculation = (syncWithRemaining = false) => {
        const loanAmount = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(interestRateInput.value);
        const tenureValue = parseFloat(tenureInput.value);
        const issueDateValue = loanIssueDateInput.value;

        if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(tenureValue) || !issueDateValue || loanAmount <= 0 || tenureValue <= 0) {
            return false;
        }

        // Parse issue date
        const [iy, im, id] = issueDateValue.split('-').map(Number);
        const issueDate = new Date(iy, im - 1, id);
        const firstEmiDate = getFirstEMIDate(issueDate);

        // Convert user total tenure to months
        const totalMonths = tenureUnit === 'years' ? Math.round(tenureValue * 12) : Math.round(tenureValue);

        // Calculate elapsed EMIs
        const elapsedEMIs = calculateElapsedEMIs(firstEmiDate, totalMonths);

        // Run Amortization Schedule up to today
        const amort = calculateAmortization(loanAmount, interestRate, totalMonths, elapsedEMIs);

        // If syncWithRemaining is requested, automatically set Refinance Tenure to exact months left
        if (syncWithRemaining) {
            const defaultMonthsLeft = amort.remainingMonths > 0 ? amort.remainingMonths : totalMonths;
            currentOfferMonths = defaultMonthsLeft;
            if (resultOfferMonthsInput) {
                resultOfferMonthsInput.value = defaultMonthsLeft;
            }
        } else if (resultOfferMonthsInput) {
            const parsedMonths = parseInt(resultOfferMonthsInput.value, 10);
            if (!isNaN(parsedMonths) && parsedMonths > 0) {
                currentOfferMonths = parsedMonths;
            }
        }

        // Determine special offer rate
        let specialRate = 9.99;
        if (resultOfferRateInput) {
            const val = parseFloat(resultOfferRateInput.value);
            if (!isNaN(val) && val >= 0) {
                specialRate = val;
            }
        }

        const specialMonths = Math.max(1, currentOfferMonths);
        const specialYears = (specialMonths / 12).toFixed(1).replace(/\.0$/, '');
        const specialYearsFormatted = `${specialMonths} Mo (${specialYears} Yrs)`;

        // Update Dynamic Titles & Headers
        if (offerRateTitle) offerRateTitle.textContent = specialRate.toString();
        if (tenureConversionBadge) tenureConversionBadge.textContent = `${specialMonths} Months (${specialYears} Years)`;

        // Calculate Special Offer on the Outstanding Balance
        const refinancePrincipal = amort.outstandingBalance > 0 ? amort.outstandingBalance : loanAmount;
        const specialEMI = calculateEMI(refinancePrincipal, specialRate, specialMonths);
        const specialAnnualPayment = specialEMI * Math.min(12, specialMonths);
        const specialTotalRepayment = specialEMI * specialMonths;

        // Current Loan remaining outflow
        const currentRemainingTotal = amort.monthlyEmi * amort.remainingMonths;
        const currentAnnualPayment = amort.monthlyEmi * Math.min(12, amort.remainingMonths);

        // Differences
        const monthlyDiff = amort.monthlyEmi - specialEMI;
        const yearlyDiff = (amort.monthlyEmi * 12) - (specialEMI * 12);
        const totalDiff = currentRemainingTotal - specialTotalRepayment;

        // 1. Update Timeline & Outstanding Status UI
        displayIssueDate.textContent = formatDateDisplay(issueDate);
        displayFirstEmiDate.textContent = formatMonthYearDisplay(firstEmiDate);
        displayEmiProgressCount.textContent = `${elapsedEMIs} / ${totalMonths} EMIs`;

        const percentPaid = totalMonths > 0 ? Math.round((elapsedEMIs / totalMonths) * 100) : 0;
        progressBarFill.style.width = `${percentPaid}%`;
        progressPercentLabel.textContent = `${percentPaid}% Completed (${elapsedEMIs} Paid)`;
        remainingEmisLabel.textContent = `${amort.remainingMonths} EMIs Remaining`;

        displayOutstandingAmount.textContent = formatCurrency(amort.outstandingBalance);
        
        const totalOriginalPayment = amort.monthlyEmi * totalMonths;
        const totalOriginalInterest = Math.max(0, totalOriginalPayment - loanAmount);
        
        displayMonthlyPayment.textContent = formatCurrency(amort.monthlyEmi);
        displayTotalInterest.textContent = formatCurrency(totalOriginalInterest);
        displayTotalRepayment.textContent = formatCurrency(totalOriginalPayment);
        
        const todayDate = new Date();
        asOfBadge.textContent = `As of ${todayDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`;

        // 2. Update Refinance Offer Card
        const specialTotalInterest = Math.max(0, specialTotalRepayment - refinancePrincipal);
        offerTenurePill.textContent = `Tenure: ${specialYearsFormatted}`;
        offerCalculatedPrincipal.textContent = formatCurrency(refinancePrincipal);
        emi999Display.textContent = formatCurrency(specialEMI);
        offerTotalInterestDisplay.textContent = formatCurrency(specialTotalInterest);
        offerTotalDisplay.textContent = formatCurrency(specialTotalRepayment);

        // 4. Update Monthly Difference
        if (monthlyDiff > 0) {
            emiDiffDisplay.textContent = `+${formatCurrency(monthlyDiff)}`;
            emiDiffDisplay.style.color = '#34d399';
            monthlyDiffLabel.textContent = 'Monthly Savings';
            monthlyDiffLabel.style.color = 'var(--secondary)';
        } else if (monthlyDiff < 0) {
            emiDiffDisplay.textContent = `-${formatCurrency(Math.abs(monthlyDiff))}`;
            emiDiffDisplay.style.color = '#f87171';
            monthlyDiffLabel.textContent = 'Extra Cost / Mo';
            monthlyDiffLabel.style.color = '#ef4444';
        } else {
            emiDiffDisplay.textContent = '₹0';
            emiDiffDisplay.style.color = 'var(--text-main)';
            monthlyDiffLabel.textContent = 'No Difference';
            monthlyDiffLabel.style.color = 'var(--text-muted)';
        }

        // 5. Update Yearly Difference
        if (yearlyDiff > 0) {
            yearDiffDisplay.textContent = `+${formatCurrency(yearlyDiff)}`;
            yearDiffDisplay.style.color = '#34d399';
            yearlyDiffLabel.textContent = 'Per Year Savings';
            yearlyDiffLabel.style.color = 'var(--secondary)';
        } else if (yearlyDiff < 0) {
            yearDiffDisplay.textContent = `-${formatCurrency(Math.abs(yearlyDiff))}`;
            yearDiffDisplay.style.color = '#f87171';
            yearlyDiffLabel.textContent = 'Extra Cost / Year';
            yearlyDiffLabel.style.color = '#ef4444';
        } else {
            yearDiffDisplay.textContent = '₹0';
            yearDiffDisplay.style.color = 'var(--text-main)';
            yearlyDiffLabel.textContent = 'No Difference';
            yearlyDiffLabel.style.color = 'var(--text-muted)';
        }

        // 6. Update Total Overall Savings
        if (totalDiff > 0) {
            totalDiffDisplay.textContent = `${formatCurrency(totalDiff)} (Total Saved)`;
            totalDiffDisplay.style.color = '#34d399';
        } else if (totalDiff < 0) {
            totalDiffDisplay.textContent = `${formatCurrency(Math.abs(totalDiff))} (Extra Total Cost)`;
            totalDiffDisplay.style.color = '#f87171';
        } else {
            totalDiffDisplay.textContent = '₹0';
            totalDiffDisplay.style.color = 'var(--text-main)';
        }

        // ==================================================================
        // Synchronize Dedicated 1080x1350 WhatsApp Share Cards (Slide 1, 2, 3)
        // ==================================================================

        // --- Card 1: Your Loan Details ---
        const card1LoanAmount = document.getElementById('card1-loan-amount');
        const card1IssueDate = document.getElementById('card1-issue-date');
        const card1FirstEmi = document.getElementById('card1-first-emi');
        const card1InterestRate = document.getElementById('card1-interest-rate');
        const card1MonthlyEmi = document.getElementById('card1-monthly-emi');
        const card1Tenure = document.getElementById('card1-tenure');
        const card1TenureYears = document.getElementById('card1-tenure-years');

        if (card1LoanAmount) card1LoanAmount.textContent = formatCurrency(loanAmount);
        if (card1IssueDate) card1IssueDate.textContent = formatDateDisplay(issueDate);
        if (card1FirstEmi) {
            card1FirstEmi.textContent = formatMonthYearDisplay(firstEmiDate);
        }
        if (card1InterestRate) card1InterestRate.textContent = `${interestRate.toFixed(2)}% p.a.`;
        if (card1MonthlyEmi) card1MonthlyEmi.textContent = formatCurrency(amort.monthlyEmi);
        if (card1Tenure) card1Tenure.textContent = `${totalMonths} Months`;
        if (card1TenureYears) {
            const tenureYears = (totalMonths / 12).toFixed(1).replace(/\.0$/, '');
            card1TenureYears.textContent = `${tenureYears} Years`;
        }

        // --- Card 2: Your Loan Today ---
        const card2Outstanding = document.getElementById('card2-outstanding-amount');
        const card2EmisToGo = document.getElementById('card2-emis-to-go');
        const card2IssueMonth = document.getElementById('card2-issue-month');
        const card2FirstEmiMonth = document.getElementById('card2-first-emi-month');
        const card2TodayMonth = document.getElementById('card2-today-month');
        const card2EmisPaidLabel = document.getElementById('card2-emis-paid-label');
        const card2ProgressPercent = document.getElementById('card2-progress-percent');
        const card2EmisLeftLabel = document.getElementById('card2-emis-left-label');
        const card2ProgressFill = document.getElementById('card2-progress-fill');
        const card2BottomNote1 = document.getElementById('card2-bottom-note-1');
        const card2BottomNote2 = document.getElementById('card2-bottom-note-2');
        const card2CurrentEmi = document.getElementById('card2-current-emi');
        const card2TotalInterest = document.getElementById('card2-total-interest');
        const card2TotalPayment = document.getElementById('card2-total-payment');

        if (card2Outstanding) card2Outstanding.textContent = formatCurrency(amort.outstandingBalance);
        if (card2EmisToGo) card2EmisToGo.textContent = `You still have ${amort.remainingMonths} EMIs to go.`;
        if (card2IssueMonth) card2IssueMonth.textContent = formatMonthYearDisplay(issueDate);
        if (card2FirstEmiMonth) card2FirstEmiMonth.textContent = formatMonthYearDisplay(firstEmiDate);
        if (card2TodayMonth) card2TodayMonth.textContent = formatMonthYearDisplay(todayDate);
        if (card2EmisPaidLabel) card2EmisPaidLabel.textContent = `${elapsedEMIs} EMIs PAID`;
        if (card2ProgressPercent) card2ProgressPercent.textContent = `${percentPaid}% COMPLETED`;
        if (card2EmisLeftLabel) card2EmisLeftLabel.textContent = `${amort.remainingMonths} EMIs LEFT`;
        if (card2ProgressFill) card2ProgressFill.style.width = `${percentPaid}%`;
        if (card2CurrentEmi) card2CurrentEmi.textContent = formatCurrency(amort.monthlyEmi);
        if (card2TotalInterest) card2TotalInterest.textContent = formatCompactLakh(totalOriginalInterest);
        if (card2TotalPayment) card2TotalPayment.textContent = formatCompactLakh(totalOriginalPayment);

        // --- Card 3: Special Refinance Offer ---
        const card3CutRate1 = document.getElementById('card3-cut-rate-1');
        const card3CutEmi = document.getElementById('card3-cut-emi');
        const card3CutRate2 = document.getElementById('card3-cut-rate-2');
        const card3CutInterest = document.getElementById('card3-cut-interest');
        const card3CutRate3 = document.getElementById('card3-cut-rate-3');
        const card3CutPayment = document.getElementById('card3-cut-payment');

        const card3NewEmi = document.getElementById('card3-new-emi');
        const card3NewInterest = document.getElementById('card3-new-interest');
        const card3NewPayment = document.getElementById('card3-new-payment');

        const card3EmiSub = document.getElementById('card3-emi-sub');
        const card3InterestSub = document.getElementById('card3-interest-sub');
        const card3PaymentSub = document.getElementById('card3-payment-sub');

        const card3MonthlySavings = document.getElementById('card3-monthly-savings');
        const card3YearlySavings = document.getElementById('card3-yearly-savings');
        const card3TotalSavings = document.getElementById('card3-total-savings');
        const card3RefinancePrincipal = document.getElementById('card3-refinance-principal');
        const card3RefinanceRate = document.getElementById('card3-refinance-rate');
        const card3RefinanceTenure = document.getElementById('card3-refinance-tenure');

        // Populate Cut (Old) Values with Strikethrough
        if (card3CutRate1) card3CutRate1.textContent = `${interestRate.toFixed(2)}%`;
        if (card3CutEmi) card3CutEmi.textContent = formatCurrency(amort.monthlyEmi);
        if (card3CutRate2) card3CutRate2.textContent = `${interestRate.toFixed(2)}%`;
        if (card3CutInterest) card3CutInterest.textContent = formatCompactLakh(totalOriginalInterest);
        if (card3CutRate3) card3CutRate3.textContent = `${interestRate.toFixed(2)}%`;
        if (card3CutPayment) card3CutPayment.textContent = formatCompactLakh(totalOriginalPayment);

        // Populate New Offer Values & Subtitles
        if (card3NewEmi) card3NewEmi.textContent = formatCurrency(specialEMI);
        if (card3EmiSub) card3EmiSub.textContent = `New EMI @ ${specialRate.toFixed(2)}%`;

        if (card3NewInterest) card3NewInterest.textContent = formatCompactLakh(specialTotalInterest);
        if (card3InterestSub) card3InterestSub.textContent = `Interest @ ${specialRate.toFixed(2)}%`;

        if (card3NewPayment) card3NewPayment.textContent = formatCompactLakh(specialTotalRepayment);
        if (card3PaymentSub) card3PaymentSub.textContent = `Total Over Loan`;

        if (card3MonthlySavings) {
            card3MonthlySavings.textContent = monthlyDiff > 0 
                ? `${formatCurrency(monthlyDiff)} / month` 
                : `₹0 / month`;
        }
        if (card3YearlySavings) {
            card3YearlySavings.textContent = yearlyDiff > 0 
                ? `${formatCurrency(yearlyDiff)} / year` 
                : `₹0 / year`;
        }
        if (card3TotalSavings) {
            card3TotalSavings.textContent = totalDiff > 0 
                ? `${formatCurrency(totalDiff)}+` 
                : `₹0`;
        }
        if (card3RefinancePrincipal) card3RefinancePrincipal.textContent = formatCurrency(refinancePrincipal);
        if (card3RefinanceRate) card3RefinanceRate.textContent = `${specialRate.toFixed(2)}% p.a.`;
        if (card3RefinanceTenure) card3RefinanceTenure.textContent = `${specialMonths} Months`;

        // If modal preview is open, update the visible preview
        updateModalPreview();

        return true;
    };

    // Live update on date change
    loanIssueDateInput.addEventListener('input', () => {
        updateDateRulePreview();
        if (!resultsSection.classList.contains('hidden')) {
            performCalculation(true);
        }
    });

    // Bank Selection Modal Logic
    const bankSelectModal = document.getElementById('bank-select-modal');
    const bankOptionBtns = document.querySelectorAll('.bank-option-btn');

    const bankLogos = {
        'Poonawalla Fincorp Limited': `<img src="./images/poonawalla_fincorp.webp" alt="Poonawalla Fincorp" style="height: 24px; vertical-align: middle; margin-right: 6px; object-fit: contain;">`,
        'Aditya Birla Capital Limited': `<img src="./images/Aditya_Birla_Capital.webp" alt="Aditya Birla Capital" style="height: 24px; vertical-align: middle; margin-right: 6px; object-fit: contain;">`,
        'Bajaj Finance Limited': `<img src="./images/bajaj_finance.webp" alt="Bajaj Finance" style="height: 24px; vertical-align: middle; margin-right: 6px; object-fit: contain;">`,
        'None': `◆`
    };

    bankOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedBank = btn.dataset.bank;
            // Get original elements from the stage directly to avoid clones if any
            const stage = document.getElementById('whatsapp-render-stage');
            const getBrandEl = (id) => stage ? stage.querySelector('#' + id) : document.getElementById(id);
            
            const card1Brand = getBrandEl('card1-brand-name');
            const card2Brand = getBrandEl('card2-brand-name');
            const card1Icon = getBrandEl('card1-brand-icon');
            const card2Icon = getBrandEl('card2-brand-icon');
            
            const displayText = (selectedBank === 'None') ? 'FINANCIAL ADVISORY' : selectedBank;
            const displayLogo = bankLogos[selectedBank] || bankLogos['None'];
            
            if (card1Brand) card1Brand.textContent = displayText;
            if (card2Brand) card2Brand.textContent = displayText;
            
            if (card1Icon) card1Icon.innerHTML = displayLogo;
            if (card2Icon) card2Icon.innerHTML = displayLogo;

            bankSelectModal.classList.add('hidden');
            bankSelectModal.setAttribute('aria-hidden', 'true');

            // Automatically default Refinance Tenure to the exact remaining months left!
            const success = performCalculation(true);
            if (success) {
                resultsSection.classList.remove('hidden');
                
                // Re-trigger animation
                resultsSection.style.animation = 'none';
                resultsSection.offsetHeight; /* trigger reflow */
                resultsSection.style.animation = null;

                // Smooth scroll into results if needed
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Form Submit Listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate inputs first before showing modal
        const loanAmount = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(interestRateInput.value);
        const tenureValue = parseFloat(tenureInput.value);
        const issueDateValue = loanIssueDateInput.value;

        if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(tenureValue) || !issueDateValue || loanAmount <= 0 || tenureValue <= 0) {
            // Let it fail normally
            performCalculation(true); 
            return;
        }

        // Show the bank selection modal instead of calculating immediately
        bankSelectModal.classList.remove('hidden');
        bankSelectModal.setAttribute('aria-hidden', 'false');
    });

    // Auto calculate if inputs change while results are open
    [loanAmountInput, interestRateInput, tenureInput].forEach(input => {
        input.addEventListener('input', () => {
            if (!resultsSection.classList.contains('hidden')) {
                performCalculation(true);
            }
        });
    });

    // ==========================================================================
    // WhatsApp 3-Image Flow: Modal, Preview, and High-Res PNG Exports
    // ==========================================================================
    let currentPreviewSlide = 1;

    // Toast Notification helper
    const showToast = (message) => {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        toast.style.opacity = '1';
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3200);
    };

    // Update live preview in modal
    const updateModalPreview = () => {
        const previewViewport = document.getElementById('preview-viewport');
        const indicatorLabel = document.getElementById('slide-indicator-label');
        const singleLabel = document.getElementById('download-single-label');
        if (!previewViewport) return;

        const targetCard = document.getElementById(`card-slide-${currentPreviewSlide}`);
        if (!targetCard) return;

        previewViewport.innerHTML = '';
        const cloned = targetCard.cloneNode(true);
        cloned.id = `preview-clone-${currentPreviewSlide}`;
        
        // Remove IDs from cloned elements to prevent document.getElementById collisions
        cloned.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        
        previewViewport.appendChild(cloned);
        
        // Dynamically adjust viewport height and scale to match container width
        setTimeout(() => {
            const viewportWidth = previewViewport.clientWidth || 320;
            const scale = viewportWidth / 1080;
            cloned.style.transform = `scale(${scale})`;
            
            const cardHeight = cloned.scrollHeight;
            if (cardHeight > 0) {
                previewViewport.style.height = (cardHeight * scale) + 'px';
            }
        }, 50);

        // Update tabs
        document.querySelectorAll('.slide-tab-btn').forEach(btn => {
            if (parseInt(btn.dataset.slide, 10) === currentPreviewSlide) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update labels
        const fileNames = {
            1: '01.png',
            2: '02.png',
            3: '03.png'
        };
        if (indicatorLabel) {
            indicatorLabel.textContent = `Slide ${currentPreviewSlide} of 3: ${fileNames[currentPreviewSlide]}`;
        }
        if (singleLabel) {
            singleLabel.textContent = `Download ${fileNames[currentPreviewSlide]}`;
        }
    };

    // Helper: Open WhatsApp Web/App with Pre-filled Caption Text
    const openWhatsAppWithCaption = () => {
        const captionText = (document.getElementById('whatsapp-caption-text') || {}).innerText || '';
        if (captionText) {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(captionText);
                }
            } catch (e) {
                console.warn('Clipboard write error:', e);
            }
        }
        const encoded = encodeURIComponent(captionText);
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const waUrl = isMobile 
            ? `https://api.whatsapp.com/send?text=${encoded}` 
            : `https://web.whatsapp.com/send?text=${encoded}`;
        
        window.open(waUrl, '_blank');
        showToast('WhatsApp opened! Select a chat, paste caption & attach 01.png, 02.png, 03.png.');
    };

    // Generate exact 1080x1350 PNG Blob via html2canvas
    const generateCardBlob = async (cardElementId) => {
        const element = document.getElementById(cardElementId);
        if (!element) throw new Error(`Card element ${cardElementId} not found`);

        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas library is not loaded');
        }

        // Render card at fixed 1080x1350 with pristine quality
        const canvas = await html2canvas(element, {
            scale: 1,
            backgroundColor: '#0B1F3A',
            useCORS: true,
            logging: false
        });

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
        });
    };

    // Download Single Slide
    const downloadSingleSlide = async (slideNum, btnElement) => {
        const now = new Date();
        const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
        const fileName = `image_${slideNum}_${timestamp}.png`;
        const cardId = `card-slide-${slideNum}`;
        const singleBtn = btnElement || document.getElementById('download-current-slide-btn');

        try {
            if (singleBtn) {
                singleBtn.disabled = true;
                singleBtn.style.opacity = '0.7';
            }
            showToast(`Rendering ${fileName}...`);
            const blob = await generateCardBlob(cardId);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1500);
            showToast(`Downloaded ${fileName}!`);
        } catch (err) {
            console.error('Error downloading slide:', err);
            alert('Failed to generate image: ' + err.message);
        } finally {
            if (singleBtn) {
                singleBtn.disabled = false;
                singleBtn.style.opacity = '1';
            }
        }
    };

    // Direct Flow: Download 3 Images (01.png, 02.png, 03.png) -> Auto-Copy Caption -> Open WhatsApp
    const download3ImagesAndOpenWhatsApp = async (triggerBtn, shouldOpenWhatsApp = true) => {
        const originalText = triggerBtn ? triggerBtn.innerHTML : '';
        try {
            if (triggerBtn) {
                triggerBtn.disabled = true;
                triggerBtn.style.opacity = '0.7';
                triggerBtn.innerHTML = '<span>Rendering 01, 02, 03.png...</span>';
            }
            showToast('Generating 01.png, 02.png, 03.png...');

            // 1. Render all 3 cards in parallel
            const [blob1, blob2, blob3] = await Promise.all([
                generateCardBlob('card-slide-1'),
                generateCardBlob('card-slide-2'),
                generateCardBlob('card-slide-3')
            ]);

            // 2. Direct automatic sequential downloads to browser's Downloads folder
            const triggerSave = (blob, filename) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 2000);
            };

            triggerSave(blob1, '01.png');
            await new Promise(r => setTimeout(r, 350));
            triggerSave(blob2, '02.png');
            await new Promise(r => setTimeout(r, 350));
            triggerSave(blob3, '03.png');

            // 3. Automatically copy companion message to clipboard
            const captionEl = document.getElementById('whatsapp-caption-text');
            const captionText = captionEl ? (captionEl.innerText || captionEl.textContent) : '';
            if (captionText && navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(captionText);
                } catch (e) {
                    console.warn('Clipboard write warning:', e);
                }
            }

            // 4. If requested, automatically open WhatsApp after starting download
            if (shouldOpenWhatsApp) {
                showToast('✅ 01.png, 02.png, 03.png downloaded! Caption copied! Opening WhatsApp...');
                setTimeout(() => {
                    openWhatsAppWithCaption();
                }, 700);
            } else {
                showToast('✅ Downloaded 01.png, 02.png, 03.png & copied caption!');
            }

        } catch (err) {
            console.error('Error in 3-image download flow:', err);
            alert('Failed to generate images: ' + err.message);
        } finally {
            if (triggerBtn) {
                triggerBtn.disabled = false;
                triggerBtn.style.opacity = '1';
                triggerBtn.innerHTML = originalText;
            }
        }
    };

    // Modal & Button Event Listeners
    const modal = document.getElementById('whatsapp-modal');
    const openModalBtn = document.getElementById('open-whatsapp-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const downloadImage1Btn = document.getElementById('download-image-1-btn');
    const downloadImage2Btn = document.getElementById('download-image-2-btn');
    const downloadImage3Btn = document.getElementById('download-image-3-btn');
    const modalDownloadAllBtn = document.getElementById('modal-download-all-btn');
    const openWhatsappDirectBtn = document.getElementById('open-whatsapp-direct-btn');
    const downloadCurrentSlideBtn = document.getElementById('download-current-slide-btn');
    const prevSlideBtn = document.getElementById('prev-slide-btn');
    const nextSlideBtn = document.getElementById('next-slide-btn');
    const slideTabs = document.querySelectorAll('.slide-tab-btn');
    const copyCaptionBtn = document.getElementById('copy-caption-btn');
    const whatsappCaptionText = document.getElementById('whatsapp-caption-text');

    const closeModal = () => {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const openModal = () => {
        if (!modal) return;
        performCalculation(false);
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        updateModalPreview();
    };

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });

        // Re-scale live preview on window resize or device orientation change
        let resizeDebounce;
        window.addEventListener('resize', () => {
            clearTimeout(resizeDebounce);
            resizeDebounce = setTimeout(() => {
                if (!modal.classList.contains('hidden')) {
                    updateModalPreview();
                }
            }, 100);
        });
    }

    slideTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const slide = parseInt(btn.dataset.slide, 10);
            if (!isNaN(slide)) {
                currentPreviewSlide = slide;
                updateModalPreview();
            }
        });
    });

    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => {
            currentPreviewSlide = currentPreviewSlide === 1 ? 3 : currentPreviewSlide - 1;
            updateModalPreview();
        });
    }

    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => {
            currentPreviewSlide = currentPreviewSlide === 3 ? 1 : currentPreviewSlide + 1;
            updateModalPreview();
        });
    }

    if (downloadCurrentSlideBtn) {
        downloadCurrentSlideBtn.addEventListener('click', () => {
            downloadSingleSlide(currentPreviewSlide);
        });
    }

    // Modal download button: Downloads 01.png, 02.png, 03.png automatically and opens WhatsApp
    if (modalDownloadAllBtn) {
        modalDownloadAllBtn.addEventListener('click', () => {
            download3ImagesAndOpenWhatsApp(modalDownloadAllBtn, true);
        });
    }

    // Direct Open WhatsApp button in modal
    if (openWhatsappDirectBtn) {
        openWhatsappDirectBtn.addEventListener('click', () => {
            openWhatsAppWithCaption();
        });
    }

    // Main page individual download buttons
    if (downloadImage1Btn) {
        downloadImage1Btn.addEventListener('click', () => {
            performCalculation(false);
            downloadSingleSlide(1, downloadImage1Btn);
        });
    }
    if (downloadImage2Btn) {
        downloadImage2Btn.addEventListener('click', () => {
            performCalculation(false);
            downloadSingleSlide(2, downloadImage2Btn);
        });
    }
    if (downloadImage3Btn) {
        downloadImage3Btn.addEventListener('click', () => {
            performCalculation(false);
            downloadSingleSlide(3, downloadImage3Btn);
        });
    }

    // Copy Caption to Clipboard
    if (copyCaptionBtn && whatsappCaptionText) {
        copyCaptionBtn.addEventListener('click', async () => {
            const textToCopy = whatsappCaptionText.innerText || whatsappCaptionText.textContent;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }
                const btnText = document.getElementById('copy-btn-text');
                if (btnText) btnText.textContent = 'Copied! ✓';
                showToast('WhatsApp caption copied to clipboard!');
                setTimeout(() => {
                    if (btnText) btnText.textContent = 'Copy Caption';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy caption:', err);
                showToast('Please manually select and copy text.');
            }
        });
    }

    // Initialize default date and initial calculation
    setDefaultIssueDate();
    performCalculation(false);
});

