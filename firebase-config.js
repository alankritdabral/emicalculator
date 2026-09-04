/**
 * Firebase Configuration and Authentication Gateway
 * Credit Expert India - Daily Access Control System
 * 
 * 100% FREE PLAN (SPARK PLAN) ARCHITECTURE:
 * - Firebase Authentication (Email/Password for Admin + Anonymous for Users)
 * - Cloud Firestore (Secure Get-Only Code Lookup)
 * - Zero Cloud Functions required (No credit card or Blaze billing needed)
 */

// =============================================================================
// 1. FIREBASE CONFIGURATION
// Replace the placeholder values below with your credentials from Firebase Console:
// Project Settings (⚙️) -> General -> "Your apps" -> Web app (</>) -> SDK setup and configuration
// =============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAQFU0rudqnsF9wcDKo0YOBbqAOzZ_ixTg",
  authDomain: "irregularhours-5f56e.firebaseapp.com",
  projectId: "irregularhours-5f56e",
  storageBucket: "irregularhours-5f56e.firebasestorage.app",
  messagingSenderId: "703529463831",
  appId: "1:703529463831:web:a9fc21d584c498481dec52",
  measurementId: "G-NXMTQ6WGK8"
};
// =============================================================================
// 2. INITIALIZATION & ENVIRONMENT DETECTION
// =============================================================================
const isConfigured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
);

let firebaseAuth = null;
let firestoreDb = null;

if (isConfigured && typeof firebase !== "undefined") {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        firebaseAuth = firebase.auth();
        firestoreDb = firebase.firestore();
        console.log("✅ Firebase initialized in 100% FREE Spark Plan mode.");
    } catch (err) {
        console.error("⚠️ Firebase initialization error:", err);
    }
} else {
    console.warn(
        "ℹ️ Running in DEMO / SIMULATION MODE.\n" +
        "To switch to live Firebase, paste your credentials into 'firebase-config.js'."
    );
}

// =============================================================================
// 3. IST (12:00 PM) TIME UTILITIES
// =============================================================================
function calculateNext12PmIST() {
    const now = new Date();
    // IST is UTC + 5.5 hours (+330 minutes)
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const istYear = istTime.getUTCFullYear();
    const istMonth = istTime.getUTCMonth();
    const istDate = istTime.getUTCDate();
    const istHours = istTime.getUTCHours();
    const istMinutes = istTime.getUTCMinutes();

    let targetIstDate = istDate;
    if (istHours > 12 || (istHours === 12 && istMinutes >= 0)) {
        targetIstDate += 1;
    }

    // 12:00 PM IST is 06:30 AM UTC
    return new Date(Date.UTC(istYear, istMonth, targetIstDate, 6, 30, 0, 0));
}

// =============================================================================
// 4. DEMO / SIMULATION MODE STORAGE HELPERS
// Used automatically when live Firebase credentials have not been configured yet.
// =============================================================================
const DEMO_STORAGE = {
    getCode: function () {
        const stored = localStorage.getItem("cei_demo_code");
        if (stored) return stored;
        const initial = "482731";
        localStorage.setItem("cei_demo_code", initial);
        return initial;
    },
    setCode: function (code, type) {
        localStorage.setItem("cei_demo_code", code);
        localStorage.setItem("cei_demo_type", type || "custom");
        localStorage.setItem("cei_demo_created", new Date().toISOString());
        localStorage.setItem("cei_demo_expiry", calculateNext12PmIST().toISOString());
    },
    getType: function () {
        return localStorage.getItem("cei_demo_type") || "random";
    },
    getExpiry: function () {
        let expiry = localStorage.getItem("cei_demo_expiry");
        if (!expiry || new Date(expiry) <= new Date()) {
            expiry = calculateNext12PmIST().toISOString();
            localStorage.setItem("cei_demo_expiry", expiry);
        }
        return expiry;
    },
    setSession: function (role, email) {
        sessionStorage.setItem("cei_auth_session", JSON.stringify({
            role: role,
            email: email || "user@local",
            loginAt: new Date().toISOString()
        }));
    },
    getSession: function () {
        const data = sessionStorage.getItem("cei_auth_session");
        return data ? JSON.parse(data) : null;
    },
    clearSession: function () {
        sessionStorage.removeItem("cei_auth_session");
    }
};

// =============================================================================
// 5. UNIFIED AUTHENTICATION & ACCESS CONTROL API (100% FREE PLAN COMPATIBLE)
// =============================================================================
const AuthSystem = {
    isLive: isConfigured,

    /**
     * Validates 6-digit daily access code.
     * In Live mode: Looks up 'access_codes/{code}' in Firestore directly.
     * Upon match, authenticates using Firebase Anonymous Auth (100% Free).
     */
    validateAccessCode: async function (code) {
        const cleanCode = String(code).trim();
        if (!cleanCode) {
            return { success: false, message: "Please enter an access code." };
        }

        if (this.isLive && firestoreDb && firebaseAuth) {
            try {
                // Direct lookup: Firestore rules allow 'get' on individual document, but forbid 'list'
                const docRef = firestoreDb.collection("access_codes").doc(cleanCode);
                const doc = await docRef.get();

                if (!doc.exists) {
                    return {
                        success: false,
                        message: "Invalid access code. Please check and try again."
                    };
                }

                const data = doc.data();
                if (data.active === false) {
                    return {
                        success: false,
                        message: "This access code has been deactivated."
                    };
                }

                // Check expiration
                if (data.expiresAt) {
                    const expTime = data.expiresAt.toDate ? data.expiresAt.toDate().getTime() : new Date(data.expiresAt).getTime();
                    if (Date.now() >= expTime) {
                        return {
                            success: false,
                            message: "Today's access code has expired (12:00 PM IST reset). Please obtain today's new code."
                        };
                    }
                }

                // Code is valid! Authenticate with Firebase Anonymous Auth (100% Free on Spark)
                await firebaseAuth.signInAnonymously();
                return { success: true, message: "Access granted." };

            } catch (error) {
                console.error("Live validation error:", error);
                return {
                    success: false,
                    message: "Validation failed: " + (error.message || "Network error. Please try again.")
                };
            }
        }

        // Demo fallback
        await new Promise((res) => setTimeout(res, 350));
        const currentActiveCode = DEMO_STORAGE.getCode();
        if (cleanCode === currentActiveCode) {
            DEMO_STORAGE.setSession("user", "user@creditexpertindia.com");
            return { success: true, message: "Access granted." };
        } else {
            return { success: false, message: "Invalid access code. Demo code is: " + currentActiveCode };
        }
    },

    /**
     * Authenticates Admin with Email & Password.
     */
    adminLogin: async function (email, password) {
        const cleanEmail = String(email).trim();
        if (!cleanEmail || !password) {
            return { success: false, message: "Email and password are required." };
        }

        if (this.isLive && firebaseAuth) {
            try {
                const cred = await firebaseAuth.signInWithEmailAndPassword(cleanEmail, password);
                // Verify admin status in Firestore 'admins' collection
                if (firestoreDb) {
                    const adminDoc = await firestoreDb.collection("admins").doc(cred.user.uid).get();
                    if (!adminDoc.exists || adminDoc.data().role !== "admin") {
                        await firebaseAuth.signOut();
                        return {
                            success: false,
                            message: `Access denied. Your account UID (${cred.user.uid}) is not registered in the Firestore 'admins' collection with role: 'admin'. Please add it in your Firebase Console.`
                        };
                    }
                }
                return { success: true, user: cred.user };
            } catch (error) {
                console.error("Admin sign-in error:", error);
                let msg = error.message;
                if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                    msg = "Invalid email or password. Please verify the credentials you created in Firebase Authentication.";
                } else if (error.code === "auth/too-many-requests") {
                    msg = "Too many failed attempts. Please wait a moment before trying again.";
                }
                return {
                    success: false,
                    message: msg || "Authentication failed. Check your email and password."
                };
            }
        }

        // Demo fallback
        await new Promise((res) => setTimeout(res, 350));
        if (cleanEmail === "admin@creditexpertindia.com" && password === "admin123") {
            DEMO_STORAGE.setSession("admin", cleanEmail);
            return { success: true, user: { email: cleanEmail, uid: "demo-admin-uid" } };
        } else {
            return {
                success: false,
                message: "Invalid admin credentials. Demo login: admin@creditexpertindia.com / admin123"
            };
        }
    },

    /**
     * Retrieves current active code, type, and expiration countdown.
     * Admin only.
     */
    adminGetCodeInfo: async function () {
        if (this.isLive && firestoreDb) {
            try {
                const doc = await firestoreDb.collection("settings").doc("accessCode").get();
                if (doc.exists) {
                    const d = doc.data();
                    const expStr = d.expiresAt ? (d.expiresAt.toDate ? d.expiresAt.toDate().toISOString() : d.expiresAt) : calculateNext12PmIST().toISOString();
                    return {
                        success: true,
                        code: d.code,
                        type: d.type || "random",
                        expiresAt: expStr
                    };
                }
            } catch (err) {
                console.error("adminGetCodeInfo error:", err);
            }
        }

        // Demo fallback
        return {
            success: true,
            code: DEMO_STORAGE.getCode(),
            type: DEMO_STORAGE.getType(),
            expiresAt: DEMO_STORAGE.getExpiry()
        };
    },

    /**
     * Generates a new random 6-digit access code and invalidates the previous one.
     * Admin only.
     */
    adminGenerateCode: async function () {
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        const nextExpiry = calculateNext12PmIST();

        if (this.isLive && firestoreDb && firebaseAuth && firebaseAuth.currentUser) {
            try {
                // Get old code to delete it
                const settingsRef = firestoreDb.collection("settings").doc("accessCode");
                const currentDoc = await settingsRef.get();
                const oldCode = currentDoc.exists ? currentDoc.data().code : null;

                const batch = firestoreDb.batch();

                // Delete old code
                if (oldCode && oldCode !== newCode) {
                    batch.delete(firestoreDb.collection("access_codes").doc(oldCode));
                }

                // Add new code document
                const newCodeRef = firestoreDb.collection("access_codes").doc(newCode);
                batch.set(newCodeRef, {
                    active: true,
                    expiresAt: firebase.firestore.Timestamp.fromDate(nextExpiry),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Update settings metadata
                batch.set(settingsRef, {
                    code: newCode,
                    type: "random",
                    expiresAt: firebase.firestore.Timestamp.fromDate(nextExpiry),
                    updatedBy: firebaseAuth.currentUser.uid,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                await batch.commit();

                return {
                    success: true,
                    code: newCode,
                    type: "random",
                    expiresAt: nextExpiry.toISOString(),
                    message: "New random code generated and activated."
                };
            } catch (err) {
                console.error("adminGenerateCode error:", err);
                return { success: false, message: err.message };
            }
        }

        // Demo fallback
        DEMO_STORAGE.setCode(newCode, "random");
        return {
            success: true,
            code: newCode,
            type: "random",
            expiresAt: DEMO_STORAGE.getExpiry(),
            message: "New random code generated successfully."
        };
    },

    /**
     * Sets a custom access code chosen by the admin.
     * Admin only.
     */
    adminSetCode: async function (customCode) {
        const cleanCode = String(customCode).trim();
        if (!cleanCode || cleanCode.length < 4 || cleanCode.length > 10) {
            return { success: false, message: "Code must be between 4 and 10 characters." };
        }

        const nextExpiry = calculateNext12PmIST();

        if (this.isLive && firestoreDb && firebaseAuth && firebaseAuth.currentUser) {
            try {
                const settingsRef = firestoreDb.collection("settings").doc("accessCode");
                const currentDoc = await settingsRef.get();
                const oldCode = currentDoc.exists ? currentDoc.data().code : null;

                const batch = firestoreDb.batch();

                // Delete old code
                if (oldCode && oldCode !== cleanCode) {
                    batch.delete(firestoreDb.collection("access_codes").doc(oldCode));
                }

                // Add new custom code document
                const newCodeRef = firestoreDb.collection("access_codes").doc(cleanCode);
                batch.set(newCodeRef, {
                    active: true,
                    expiresAt: firebase.firestore.Timestamp.fromDate(nextExpiry),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Update settings metadata
                batch.set(settingsRef, {
                    code: cleanCode,
                    type: "custom",
                    expiresAt: firebase.firestore.Timestamp.fromDate(nextExpiry),
                    updatedBy: firebaseAuth.currentUser.uid,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                await batch.commit();

                return {
                    success: true,
                    code: cleanCode,
                    type: "custom",
                    expiresAt: nextExpiry.toISOString(),
                    message: "Custom access code activated."
                };
            } catch (err) {
                console.error("adminSetCode error:", err);
                return { success: false, message: err.message };
            }
        }

        // Demo fallback
        DEMO_STORAGE.setCode(cleanCode, "custom");
        return {
            success: true,
            code: cleanCode,
            type: "custom",
            expiresAt: DEMO_STORAGE.getExpiry(),
            message: "Custom access code saved successfully."
        };
    },

    /**
     * Subscribes to authentication state changes.
     */
    onAuthStateChanged: function (callback) {
        if (this.isLive && firebaseAuth) {
            firebaseAuth.onAuthStateChanged(async (user) => {
                if (!user) {
                    callback(null);
                    return;
                }
                let role = user.isAnonymous ? "user" : "user";
                if (firestoreDb && user.email) {
                    try {
                        const adminDoc = await firestoreDb.collection("admins").doc(user.uid).get();
                        if (adminDoc.exists && adminDoc.data().role === "admin") {
                            role = "admin";
                        }
                    } catch (e) {
                        console.warn("Admin check warning:", e);
                    }
                }
                callback({
                    uid: user.uid,
                    email: user.email,
                    isAnonymous: user.isAnonymous,
                    role: role
                });
            });
            return;
        }

        // Demo fallback
        const session = DEMO_STORAGE.getSession();
        if (session) {
            callback({
                uid: "demo-uid",
                email: session.email,
                role: session.role
            });
        } else {
            callback(null);
        }
    },

    /**
     * Signs out the current session.
     */
    logout: async function () {
        if (this.isLive && firebaseAuth) {
            await firebaseAuth.signOut();
        }
        DEMO_STORAGE.clearSession();
        window.location.href = "login.html";
    }
};

// Make available globally
window.AuthSystem = AuthSystem;
