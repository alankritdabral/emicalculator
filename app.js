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

        return true;
    };

    // Live update on date change
    loanIssueDateInput.addEventListener('input', () => {
        updateDateRulePreview();
        if (!resultsSection.classList.contains('hidden')) {
            performCalculation(true);
        }
    });

    // Form Submit Listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();

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

    // Auto calculate if inputs change while results are open
    [loanAmountInput, interestRateInput, tenureInput].forEach(input => {
        input.addEventListener('input', () => {
            if (!resultsSection.classList.contains('hidden')) {
                performCalculation(true);
            }
        });
    });

    // Download PDF functionality
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', async () => {
            let originalScrollY = window.scrollY;
            try {
                const btnTextSpan = downloadPdfBtn.querySelector('span');
                if (btnTextSpan) btnTextSpan.innerText = 'Generating PDF...';
                downloadPdfBtn.disabled = true;
                downloadPdfBtn.style.opacity = '0.7';

                // Ensure html2pdf is loaded
                if (typeof html2pdf === 'undefined') {
                    alert('PDF generation library is not loaded. Please try again later.');
                    return;
                }

                // Temporarily hide parts we don't want in the PDF
                const actionButtons = document.querySelector('.action-buttons');
                if (actionButtons) actionButtons.style.display = 'none';

                // Select the results container
                const element = document.getElementById('results');
                
                // Temporarily apply solid background and disable animations to prevent blank/transparent renders
                element.style.background = '#ffffff';
                element.style.padding = '0';
                element.style.borderRadius = '0';
                element.style.animation = 'none';
                element.style.transform = 'none';

                // Stretch cards to beautifully fill the A4 pages
                const cards = element.querySelectorAll('.result-card');
                const originalCardStyles = [];
                cards.forEach(card => {
                    originalCardStyles.push({
                        display: card.style.display,
                        flexDirection: card.style.flexDirection,
                        justifyContent: card.style.justifyContent,
                        minHeight: card.style.minHeight,
                        padding: card.style.padding,
                        marginBottom: card.style.marginBottom
                    });
                    
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.justifyContent = 'space-evenly';
                    card.style.minHeight = '800px'; // A4 printable area relative height
                    card.style.padding = '3rem'; // Add luxurious breathing room
                    card.style.marginBottom = '0'; // Remove margin to prevent accidental spillover
                });

                // Force page break before the second card
                const secondaryCard = document.querySelector('.result-card.secondary');
                if (secondaryCard) {
                    secondaryCard.style.pageBreakBefore = 'always';
                }

                // Ensure we capture from the top to avoid scroll-related blank pages
                window.scrollTo(0, 0);

                // Configure PDF options
                const opt = {
                    margin:       [0.5, 0.5, 0.5, 0.5],
                    filename:     'emi_calculator_details.pdf',
                    image:        { type: 'jpeg', quality: 1.0 },
                    html2canvas:  { 
                        scale: 2, 
                        backgroundColor: '#ffffff', 
                        useCORS: true,
                        scrollY: 0
                    },
                    pagebreak:    { mode: 'css' },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
                };

                // Generate and download PDF
                await html2pdf().set(opt).from(element).save();
                
            } catch (err) {
                console.error('Error during PDF generation:', err);
                alert('An error occurred while generating the PDF.');
            } finally {
                const btnTextSpan = downloadPdfBtn.querySelector('span');
                if (btnTextSpan) btnTextSpan.innerText = 'Download PDF';
                downloadPdfBtn.disabled = false;
                downloadPdfBtn.style.opacity = '1';
                
                // Restore original styles to the results container
                const element = document.getElementById('results');
                if (element) {
                    element.style.background = '';
                    element.style.padding = '';
                    element.style.borderRadius = '';
                    element.style.animation = '';
                    element.style.transform = '';
                }

                // Restore card styles
                const cards = element.querySelectorAll('.result-card');
                cards.forEach((card, index) => {
                    if (originalCardStyles[index]) {
                        card.style.display = originalCardStyles[index].display;
                        card.style.flexDirection = originalCardStyles[index].flexDirection;
                        card.style.justifyContent = originalCardStyles[index].justifyContent;
                        card.style.minHeight = originalCardStyles[index].minHeight;
                        card.style.padding = originalCardStyles[index].padding;
                        card.style.marginBottom = originalCardStyles[index].marginBottom;
                    }
                });

                // Restore page break rule
                const secondaryCard = document.querySelector('.result-card.secondary');
                if (secondaryCard) {
                    secondaryCard.style.pageBreakBefore = '';
                }
                
                window.scrollTo(0, originalScrollY);
                
                // Restore visibility
                const actionButtons = document.querySelector('.action-buttons');
                if (actionButtons) actionButtons.style.display = '';
            }
        });
    }

    // Initialize default date
    setDefaultIssueDate();
});
