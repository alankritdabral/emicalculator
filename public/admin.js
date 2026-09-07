
        // Check Demo mode
        if (!window.AuthSystem.isLive) {
            document.getElementById("demo-banner").style.display = "flex";
        }

        let currentCode = "";
        let expiryTimestamp = null;
        let countdownInterval = null;

        // Security Guard: Check Admin Authorization
        window.AuthSystem.onAuthStateChanged((user) => {
            if (!user || user.role !== "admin") {
                window.location.href = "login.html";
            } else {
                document.getElementById("display-admin-email").textContent = user.email || "Admin";
                loadCodeInfo();
            }
        });

        // Load active code details
        async function loadCodeInfo() {
            try {
                const info = await window.AuthSystem.adminGetCodeInfo();
                if (info && info.code) {
                    currentCode = info.code;
                    document.getElementById("active-code-display").textContent = info.code;
                    
                    const typeBadge = document.getElementById("active-code-type");
                    typeBadge.textContent = (info.type || "random").toUpperCase();
                    typeBadge.className = "meta-chip " + (info.type === "custom" ? "type-custom" : "type-random");

                    expiryTimestamp = new Date(info.expiresAt).getTime();
                    startCountdown();
                }
            } catch (err) {
                showAlert("Failed to load code info: " + err.message, "error");
            }
        }

        // Live Countdown to 12:00 AM IST (Midnight)
        function startCountdown() {
            if (countdownInterval) clearInterval(countdownInterval);

            function update() {
                const now = Date.now();
                // Target is ALWAYS the upcoming 12:00 AM IST (Midnight)
                const getTarget = typeof calculateNext12AmIST === "function"
                    ? calculateNext12AmIST
                    : (window.calculateNext12AmIST ? window.calculateNext12AmIST : (() => new Date(now + 3600000)));

                const targetTimestamp = getTarget().getTime();
                const diff = Math.max(0, targetTimestamp - now);
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                const pad = (n) => String(n).padStart(2, "0");
                document.getElementById("countdown-timer").textContent = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
            }

            update();
            countdownInterval = setInterval(update, 1000);
        }

        // Alert helper
        function showAlert(msg, type) {
            const box = document.getElementById("admin-alert");
            box.className = "auth-alert " + (type || "success");
            box.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
                    ${type === "error" 
                        ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
                        : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'}
                </svg>
                <span>${msg}</span>
            `;
            box.style.display = "flex";
            setTimeout(() => { box.style.display = "none"; }, 5000);
        }

        // Copy Code to Clipboard
        function copyCurrentCode() {
            if (!currentCode) return;
            navigator.clipboard.writeText(currentCode).then(() => {
                const label = document.getElementById("copy-label");
                label.textContent = "Copied!";
                setTimeout(() => { label.textContent = "Copy Code"; }, 2000);
            });
        }

        // Generate Random Code Handler
        async function handleGenerateRandom() {
            const btn = document.getElementById("btn-generate-random");
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner"></span><span>Generating...</span>`;

            try {
                const res = await window.AuthSystem.adminGenerateCode();
                if (res.success) {
                    showAlert(res.message || "New random code active.", "success");
                    loadCodeInfo();
                } else {
                    showAlert(res.message || "Failed to generate code.", "error");
                }
            } catch (e) {
                showAlert("Error: " + e.message, "error");
            } finally {
                btn.disabled = false;
                btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg><span>Generate New Code</span>`;
            }
        }

        // Set Custom Code Handler
        async function handleSetCustom() {
            const input = document.getElementById("custom-code-input");
            const customCode = input.value.trim();
            if (!customCode || customCode.length < 4 || customCode.length > 10) {
                showAlert("Custom code must be between 4 and 10 characters.", "error");
                return;
            }

            const btn = document.getElementById("btn-set-custom");
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner"></span>`;

            try {
                const res = await window.AuthSystem.adminSetCode(customCode);
                if (res.success) {
                    input.value = "";
                    showAlert(res.message || "Custom code activated successfully.", "success");
                    loadCodeInfo();
                } else {
                    showAlert(res.message || "Failed to set custom code.", "error");
                }
            } catch (e) {
                showAlert("Error: " + e.message, "error");
            } finally {
                btn.disabled = false;
                btn.innerHTML = `<span>Save</span>`;
            }
        }

        window.copyCurrentCode = copyCurrentCode;
        window.handleGenerateRandom = handleGenerateRandom;
        window.handleSetCustom = handleSetCustom;

    