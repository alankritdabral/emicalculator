document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emi-form');
    const resultsSection = document.getElementById('results');

    // Inputs
    const totalAmountInput = document.getElementById('total-amount');
    const outstandingAmountInput = document.getElementById('outstanding-amount');
    const interestRateInput = document.getElementById('interest-rate');
    const tenureInput = document.getElementById('tenure');
    const tenureUnitLabel = document.getElementById('tenure-unit-label');
    const tenureUnitButtons = document.querySelectorAll('#tenure-unit-switch .unit-btn');
    
    // Custom Offer Controls
    const customOfferToggle = document.getElementById('custom-offer-toggle');
    const customOfferControls = document.getElementById('custom-offer-controls');
    const offerTenureYearsInput = document.getElementById('offer-tenure-years');
    const formChipButtons = document.querySelectorAll('.chips-group .chip-btn');
    
    // Result displays
    const monthlyEmiDisplay = document.getElementById('monthly-emi');
    const currentAnnualDisplay = document.getElementById('current-annual-payment');
    const currentTotalDisplay = document.getElementById('current-total-payment');
    
    const offerTenurePill = document.getElementById('offer-tenure-pill');
    const emi999Display = document.getElementById('emi-999');
    const offerAnnualDisplay = document.getElementById('offer-annual-payment');
    const offerTotalDisplay = document.getElementById('offer-total-payment');
    
    const emiDiffDisplay = document.getElementById('emi-diff');
    const monthlyDiffLabel = document.getElementById('monthly-diff-label');
    const yearDiffDisplay = document.getElementById('year-diff');
    const yearlyDiffLabel = document.getElementById('yearly-diff-label');
    const totalDiffDisplay = document.getElementById('total-diff');
    const totalSavingRow = document.getElementById('total-saving-row');
    
    const resultTenurePills = document.querySelectorAll('#result-tenure-pills .pill-btn');
    const breakdownToggleBtn = document.getElementById('breakdown-toggle-btn');
    const breakdownContent = document.getElementById('breakdown-content');
    const breakdownTableBody = document.getElementById('breakdown-table-body');
    const breakdownTableFoot = document.getElementById('breakdown-table-foot');

    let tenureUnit = 'months'; // 'months' or 'years'
    let currentOfferYears = 3;

    // Currency Formatter
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Math.round(amount));
    };

    // Calculate EMI function
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
                performCalculation();
            }
        });
    });

    // Toggle Custom Offer Section
    customOfferToggle.addEventListener('change', () => {
        if (customOfferToggle.checked) {
            customOfferControls.classList.remove('collapsed');
        } else {
            customOfferControls.classList.add('collapsed');
        }
        if (!resultsSection.classList.contains('hidden')) {
            performCalculation();
        }
    });

    // Form Quick Chips (1, 2, 3, 4, 5 Yrs)
    formChipButtons.forEach(chip => {
        chip.addEventListener('click', () => {
            formChipButtons.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const years = parseFloat(chip.dataset.years);
            offerTenureYearsInput.value = years;
            currentOfferYears = years;
            syncResultPills(years);
            if (!resultsSection.classList.contains('hidden')) {
                performCalculation();
            }
        });
    });

    offerTenureYearsInput.addEventListener('input', () => {
        const val = parseFloat(offerTenureYearsInput.value);
        if (!isNaN(val) && val > 0) {
            currentOfferYears = val;
            syncChipActiveState(val);
            syncResultPills(val);
            if (!resultsSection.classList.contains('hidden')) {
                performCalculation();
            }
        }
    });

    // Synchronize Active Chip State in Form
    const syncChipActiveState = (years) => {
        formChipButtons.forEach(chip => {
            if (parseFloat(chip.dataset.years) === years) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    };

    // Synchronize Result Quick Pills
    const syncResultPills = (years) => {
        resultTenurePills.forEach(pill => {
            if (parseFloat(pill.dataset.years) === years) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    };

    // Live Pill Buttons in Result Card
    resultTenurePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const years = parseFloat(pill.dataset.years);
            currentOfferYears = years;
            offerTenureYearsInput.value = years;
            customOfferToggle.checked = true;
            customOfferControls.classList.remove('collapsed');
            syncChipActiveState(years);
            syncResultPills(years);
            performCalculation();
        });
    });

    // Year-by-Year Breakdown Toggle
    breakdownToggleBtn.addEventListener('click', () => {
        const isHidden = breakdownContent.classList.contains('hidden');
        if (isHidden) {
            breakdownContent.classList.remove('hidden');
            breakdownToggleBtn.classList.add('expanded');
        } else {
            breakdownContent.classList.add('hidden');
            breakdownToggleBtn.classList.remove('expanded');
        }
    });

    // Populate Year-by-Year Schedule Table
    const populateYearlyBreakdown = (userEMI, userMonths, specialEMI, specialMonths) => {
        breakdownTableBody.innerHTML = '';
        if (breakdownTableFoot) breakdownTableFoot.innerHTML = '';

        const totalYears = Math.ceil(Math.max(userMonths, specialMonths) / 12);
        let totalUserPayment = 0;
        let totalSpecialPayment = 0;

        for (let y = 1; y <= totalYears; y++) {
            const userMonthsInYear = Math.max(0, Math.min(12, userMonths - (y - 1) * 12));
            const specialMonthsInYear = Math.max(0, Math.min(12, specialMonths - (y - 1) * 12));

            const currentYearPayment = userEMI * userMonthsInYear;
            const specialYearPayment = specialEMI * specialMonthsInYear;
            const yearlyDiff = currentYearPayment - specialYearPayment;

            totalUserPayment += currentYearPayment;
            totalSpecialPayment += specialYearPayment;

            const tr = document.createElement('tr');

            const diffClass = yearlyDiff > 0 ? 'diff-positive' : (yearlyDiff < 0 ? 'diff-negative' : '');
            const diffPrefix = yearlyDiff > 0 ? '+ ' : (yearlyDiff < 0 ? '- ' : '');
            const diffText = yearlyDiff !== 0 
                ? `${diffPrefix}${formatCurrency(Math.abs(yearlyDiff))} (${yearlyDiff > 0 ? 'Saved' : 'Cost'})`
                : '₹0';

            tr.innerHTML = `
                <td>Year ${y}</td>
                <td>${userMonthsInYear > 0 ? formatCurrency(currentYearPayment) : '-'}</td>
                <td>${specialMonthsInYear > 0 ? formatCurrency(specialYearPayment) : '-'}</td>
                <td class="${diffClass}">${diffText}</td>
            `;

            breakdownTableBody.appendChild(tr);
        }

        // Populate Total Payment Footer Row
        if (breakdownTableFoot) {
            const totalDiff = totalUserPayment - totalSpecialPayment;
            const totalDiffClass = totalDiff > 0 ? 'diff-positive' : (totalDiff < 0 ? 'diff-negative' : '');
            const totalDiffPrefix = totalDiff > 0 ? '+ ' : (totalDiff < 0 ? '- ' : '');
            const totalDiffText = totalDiff !== 0
                ? `${totalDiffPrefix}${formatCurrency(Math.abs(totalDiff))} (${totalDiff > 0 ? 'Total Saved' : 'Total Cost'})`
                : '₹0';

            const footTr = document.createElement('tr');
            footTr.className = 'total-row';
            footTr.innerHTML = `
                <td><strong>Total Payment</strong></td>
                <td><strong>${formatCurrency(totalUserPayment)}</strong></td>
                <td><strong>${formatCurrency(totalSpecialPayment)}</strong></td>
                <td class="${totalDiffClass}"><strong>${totalDiffText}</strong></td>
            `;
            breakdownTableFoot.appendChild(footTr);
        }
    };

    // Perform Full Calculation and UI Update
    const performCalculation = () => {
        const outstandingAmount = parseFloat(outstandingAmountInput.value);
        const interestRate = parseFloat(interestRateInput.value);
        const tenureValue = parseFloat(tenureInput.value);

        if (isNaN(outstandingAmount) || isNaN(interestRate) || isNaN(tenureValue) || outstandingAmount <= 0 || tenureValue <= 0) {
            return false;
        }

        // Convert user tenure to months
        const userMonths = tenureUnit === 'years' ? Math.round(tenureValue * 12) : Math.round(tenureValue);
        const userYears = (userMonths / 12).toFixed(1).replace(/\.0$/, '');

        // Determine special 9.99% tenure (months)
        let specialMonths = userMonths;
        let specialYearsFormatted = `${userYears} Yrs (${userMonths} Mo)`;

        if (customOfferToggle.checked) {
            const customYears = parseFloat(offerTenureYearsInput.value) || currentOfferYears || 3;
            specialMonths = Math.round(customYears * 12);
            specialYearsFormatted = `${customYears} Yrs (${specialMonths} Mo)`;
        }

        // Calculate User Loan Metrics
        const userEMI = calculateEMI(outstandingAmount, interestRate, userMonths);
        const userAnnualPayment = userEMI * Math.min(12, userMonths);
        const userTotalPayment = userEMI * userMonths;

        // Calculate 9.99% Special Loan Metrics
        const specialRate = 9.99;
        const specialEMI = calculateEMI(outstandingAmount, specialRate, specialMonths);
        const specialAnnualPayment = specialEMI * Math.min(12, specialMonths);
        const specialTotalPayment = specialEMI * specialMonths;

        // Differences
        const monthlyDiff = userEMI - specialEMI;
        const yearlyDiff = (userEMI * 12) - (specialEMI * 12); // Standardized annual difference
        const totalDiff = userTotalPayment - specialTotalPayment;

        // Update Current Loan UI
        monthlyEmiDisplay.textContent = formatCurrency(userEMI);
        currentAnnualDisplay.textContent = formatCurrency(userAnnualPayment);
        currentTotalDisplay.textContent = formatCurrency(userTotalPayment);

        // Update Offer Loan UI
        offerTenurePill.textContent = `Tenure: ${specialYearsFormatted}`;
        emi999Display.textContent = formatCurrency(specialEMI);
        offerAnnualDisplay.textContent = formatCurrency(specialAnnualPayment);
        offerTotalDisplay.textContent = formatCurrency(specialTotalPayment);

        // Update Monthly Difference Card
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

        // Update Yearly Difference Card
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

        // Update Total Savings Row
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

        // Populate yearly breakdown table
        populateYearlyBreakdown(userEMI, userMonths, specialEMI, specialMonths);

        return true;
    };

    // Form Submit Listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const success = performCalculation();
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
    [outstandingAmountInput, interestRateInput, tenureInput].forEach(input => {
        input.addEventListener('input', () => {
            if (!resultsSection.classList.contains('hidden')) {
                performCalculation();
            }
        });
    });
});
