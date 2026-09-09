
        // Check if Demo Mode banner should be shown
        if (!window.AuthSystem.isLive) {
            document.getElementById("demo-banner").style.display = "flex";
        }

        // Support direct #admin hash in URL
        if (window.location.hash === "#admin") {
            switchTab("admin");
        }

        // Auto-redirect ONLY if authenticated as Admin
        window.AuthSystem.onAuthStateChanged((user) => {
            if (user && user.role === "admin") {
                window.location.href = "/admin";
            }
        });

        // Tab Switching Logic
        function switchTab(tab) {
            clearAlert();
            const tabUser = document.getElementById("tab-user");
            const tabAdmin = document.getElementById("tab-admin");
            const formUser = document.getElementById("user-code-form");
            const formAdmin = document.getElementById("admin-login-form");

            if (tab === "user") {
                tabUser.classList.add("active");
                tabAdmin.classList.remove("active");
                formUser.style.display = "block";
                formAdmin.style.display = "none";
                pinDigits[0].focus();
            } else {
                tabAdmin.classList.add("active");
                tabUser.classList.remove("active");
                formUser.style.display = "none";
                formAdmin.style.display = "block";
                document.getElementById("admin-email").focus();
            }
        }

        // PIN Inputs Navigation & Auto-jump
        const pinDigits = document.querySelectorAll(".pin-digit");
        pinDigits.forEach((input, index) => {
            input.addEventListener("input", (e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                e.target.value = val ? val[0] : "";
                if (val) {
                    input.classList.add("filled");
                    if (index < pinDigits.length - 1) {
                        pinDigits[index + 1].focus();
                    }
                } else {
                    input.classList.remove("filled");
                }

                // Check if all 6 digits entered
                const fullPin = getEnteredPin();
                if (fullPin.length === 6) {
                    const submitBtn = document.getElementById("btn-verify-user");
                    if (submitBtn) submitBtn.click();
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !input.value && index > 0) {
                    pinDigits[index - 1].focus();
                } else if (e.key === "ArrowLeft" && index > 0) {
                    pinDigits[index - 1].focus();
                } else if (e.key === "ArrowRight" && index < pinDigits.length - 1) {
                    pinDigits[index + 1].focus();
                }
            });

            // Support pasting 6-digit code directly
            input.addEventListener("paste", (e) => {
                e.preventDefault();
                const pasteData = (e.clipboardData || window.clipboardData).getData("text").replace(/[^0-9]/g, "");
                if (pasteData.length >= 6) {
                    for (let i = 0; i < 6; i++) {
                        pinDigits[i].value = pasteData[i];
                        pinDigits[i].classList.add("filled");
                    }
                    pinDigits[5].focus();
                    const submitBtn = document.getElementById("btn-verify-user");
                    if (submitBtn) submitBtn.click();
                }
            });
        });

        function getEnteredPin() {
            let pin = "";
            pinDigits.forEach(input => pin += input.value);
            return pin;
        }

        // Rate Limiting & Cooldown Protection (5 failed attempts -> 60s cooldown)
        let failedAttempts = parseInt(localStorage.getItem("cei_failed_attempts") || "0", 10);
        let cooldownUntil = parseInt(localStorage.getItem("cei_cooldown_until") || "0", 10);

        function checkCooldown() {
            const now = Date.now();
            if (now < cooldownUntil) {
                const remainingSecs = Math.ceil((cooldownUntil - now) / 1000);
                showAlert(`Too many failed attempts. Please wait ${remainingSecs} seconds before trying again.`, "error");
                const btn = document.getElementById("btn-verify-user");
                btn.disabled = true;
                return true;
            }
            return false;
        }

        // Alert banner handler
        function showAlert(message, type) {
            const alertBox = document.getElementById("auth-alert");
            alertBox.className = `auth-alert ${type}`;
            alertBox.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${type === "success" 
                        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
                </svg>
                <span>${message}</span>
            `;
            alertBox.style.display = "flex";
        }

        function clearAlert() {
            const alertBox = document.getElementById("auth-alert");
            alertBox.style.display = "none";
        }

        // Form Submission: User Access Code
        async function handleUserSubmit(e) {
            e.preventDefault();
            if (checkCooldown()) return;

            const code = getEnteredPin();
            if (code.length < 6) {
                showAlert("Please enter all 6 digits of the daily access code.", "error");
                return;
            }

            const btn = document.getElementById("btn-verify-user");
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner"></span><span>Verifying Access...</span>`;
            clearAlert();

            try {
                const res = await window.AuthSystem.validateAccessCode(code);
                if (res.success) {
                    localStorage.removeItem("cei_failed_attempts");
                    showAlert("Access verified! Redirecting to calculator...", "success");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 500);
                } else {
                    failedAttempts += 1;
                    localStorage.setItem("cei_failed_attempts", failedAttempts);
                    if (failedAttempts >= 5) {
                        cooldownUntil = Date.now() + 60000;
                        localStorage.setItem("cei_cooldown_until", cooldownUntil);
                        checkCooldown();
                    } else {
                        showAlert(res.message || "Invalid access code. Please check and try again.", "error");
                        // Clear PIN digits
                        pinDigits.forEach(input => { input.value = ""; input.classList.remove("filled"); });
                        pinDigits[0].focus();
                    }
                    btn.disabled = false;
                    btn.innerHTML = `<span>Unlock Calculator</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
                }
            } catch (err) {
                showAlert("Verification error: " + err.message, "error");
                btn.disabled = false;
                btn.innerHTML = `<span>Unlock Calculator</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
            }
        }

        // Form Submission: Admin Login
        async function handleAdminSubmit(e) {
            e.preventDefault();
            const email = document.getElementById("admin-email").value;
            const password = document.getElementById("admin-password").value;

            const btn = document.getElementById("btn-login-admin");
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner"></span><span>Authenticating Admin...</span>`;
            clearAlert();

            try {
                const res = await window.AuthSystem.adminLogin(email, password);
                if (res.success) {
                    showAlert("Authentication successful! Redirecting...", "success");
                    setTimeout(() => {
                        window.location.href = "/admin";
                    }, 500);
                } else {
                    showAlert(res.message || "Admin authentication failed.", "error");
                    btn.disabled = false;
                    btn.innerHTML = `<span>Sign In to Dashboard</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`;
                }
            } catch (err) {
                showAlert("Error: " + err.message, "error");
                btn.disabled = false;
                btn.innerHTML = `<span>Sign In to Dashboard</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`;
            }
        }

        window.switchTab = switchTab;
        window.handleUserSubmit = handleUserSubmit;
        window.handleAdminSubmit = handleAdminSubmit;

    