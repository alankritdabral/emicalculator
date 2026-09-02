document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emi-form');
    const resultsSection = document.getElementById('results');
    
    // Result elements
    const monthlyEmiDisplay = document.getElementById('monthly-emi');
    const emi999Display = document.getElementById('emi-999');
    const emiDiffDisplay = document.getElementById('emi-diff');

    // Format number as Indian Rupee currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate EMI function
    const calculateEMI = (principal, annualRate, months) => {
        if (principal === 0 || months === 0) return 0;
        if (annualRate === 0) return principal / months;

        const r = annualRate / (12 * 100); // monthly interest rate
        const n = months;
        
        // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
        const numerator = principal * r * Math.pow(1 + r, n);
        const denominator = Math.pow(1 + r, n) - 1;
        
        return numerator / denominator;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get inputs
        const totalAmount = parseFloat(document.getElementById('total-amount').value);
        const outstandingAmount = parseFloat(document.getElementById('outstanding-amount').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value);
        const tenure = parseInt(document.getElementById('tenure').value);

        if (isNaN(outstandingAmount) || isNaN(interestRate) || isNaN(tenure)) {
            return; // Basic validation
        }

        // Calculate User EMI
        const userEMI = calculateEMI(outstandingAmount, interestRate, tenure);

        // Calculate EMI at 9.99%
        const specialRate = 9.99;
        const specialEMI = calculateEMI(outstandingAmount, specialRate, tenure);

        // Calculate Difference
        const difference = userEMI - specialEMI;

        // Update UI
        monthlyEmiDisplay.textContent = formatCurrency(userEMI);
        emi999Display.textContent = formatCurrency(specialEMI);
        
        if (difference > 0) {
            emiDiffDisplay.textContent = `${formatCurrency(difference)} (Savings with 9.99%)`;
            emiDiffDisplay.style.color = 'var(--secondary)';
        } else if (difference < 0) {
            emiDiffDisplay.textContent = `${formatCurrency(Math.abs(difference))} (Extra cost vs 9.99%)`;
            emiDiffDisplay.style.color = '#ef4444'; // Red color for loss
        } else {
            emiDiffDisplay.textContent = '₹0';
            emiDiffDisplay.style.color = 'var(--text-main)';
        }

        // Show results with animation
        resultsSection.classList.remove('hidden');
        
        // Optional: Add a slight delay to re-trigger animation if already visible
        resultsSection.style.animation = 'none';
        resultsSection.offsetHeight; /* trigger reflow */
        resultsSection.style.animation = null;
    });
});
