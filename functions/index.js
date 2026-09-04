const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Calculates the next 12:00 PM IST expiration timestamp.
 * IST is UTC + 5:30.
 * 12:00 PM IST is 06:30:00 UTC.
 */
function getNext12PmIST() {
  const now = new Date();
  // IST offset is +5.5 hours (+330 minutes)
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

  const istYear = istTime.getUTCFullYear();
  const istMonth = istTime.getUTCMonth();
  const istDate = istTime.getUTCDate();
  const istHours = istTime.getUTCHours();
  const istMinutes = istTime.getUTCMinutes();

  // If current IST time is before 12:00 PM IST (noon), expires today at 12:00 PM IST (06:30 UTC).
  // If current IST time is at or after 12:00 PM IST, expires tomorrow at 12:00 PM IST.
  let targetIstDate = istDate;
  if (istHours > 12 || (istHours === 12 && istMinutes >= 0)) {
    targetIstDate += 1;
  }

  // 12:00 PM IST = 06:30 AM UTC
  return new Date(Date.UTC(istYear, istMonth, targetIstDate, 6, 30, 0, 0));
}

/**
 * Helper to generate a secure random 6-digit access code
 */
function generateRandom6Digit() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Helper to verify if the caller is an authenticated admin.
 */
async function verifyIsAdmin(context) {
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required."
    );
  }

  // Check if token has admin custom claim
  if (context.auth.token.admin === true) {
    return true;
  }

  // Check Firestore 'admins/{uid}' collection
  const adminDoc = await db.collection("admins").doc(context.auth.uid).get();
  if (adminDoc.exists && adminDoc.data().role === "admin") {
    return true;
  }

  throw new functions.https.HttpsError(
    "permission-denied",
    "Access restricted to administrators only."
  );
}

/**
 * Helper to retrieve or rotate the active access code.
 */
async function getOrRotateAccessCode() {
  const codeRef = db.collection("settings").doc("accessCode");
  const doc = await codeRef.get();
  const now = new Date();

  let needsRotation = false;
  let currentData = null;

  if (!doc.exists) {
    needsRotation = true;
  } else {
    currentData = doc.data();
    if (!currentData.expiresAt || now.getTime() >= currentData.expiresAt.toDate().getTime()) {
      needsRotation = true;
    }
  }

  if (needsRotation) {
    const newCode = generateRandom6Digit();
    const nextExpiry = getNext12PmIST();
    const newDoc = {
      code: newCode,
      type: "random",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(nextExpiry),
      updatedBy: "system_daily_rotation",
      version: currentData && currentData.version ? currentData.version + 1 : 1,
    };
    await codeRef.set(newDoc);
    return {
      code: newCode,
      type: "random",
      expiresAt: nextExpiry.toISOString(),
      version: newDoc.version,
    };
  }

  return {
    code: currentData.code,
    type: currentData.type || "random",
    expiresAt: currentData.expiresAt.toDate().toISOString(),
    version: currentData.version || 1,
  };
}

/**
 * Cloud Function: validateAccessCode
 * Publicly callable function that validates the user-submitted code.
 * Performs on-demand rotation if 12:00 PM IST has passed.
 * Returns a custom authentication token upon successful validation.
 */
exports.validateAccessCode = functions.https.onCall(async (data, context) => {
  const submittedCode = (data && data.code ? String(data.code).trim() : "");
  if (!submittedCode) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Please enter an access code."
    );
  }

  // Get active code (rotates automatically if expired)
  const activeCodeData = await getOrRotateAccessCode();

  if (submittedCode !== activeCodeData.code) {
    return {
      success: false,
      message: "Invalid access code. Please check and try again.",
    };
  }

  // Code is valid - generate a custom token for anonymous user session
  const anonymousUid = "user_" + Math.random().toString(36).substring(2, 12);
  const customToken = await admin.auth().createCustomToken(anonymousUid, {
    role: "user",
    codeVersion: activeCodeData.version,
  });

  return {
    success: true,
    token: customToken,
    expiresAt: activeCodeData.expiresAt,
    message: "Access granted.",
  };
});

/**
 * Cloud Function: getAccessCodeInfo
 * Admin-only: Retrieves current code, expiry countdown, and metadata.
 */
exports.getAccessCodeInfo = functions.https.onCall(async (data, context) => {
  await verifyIsAdmin(context);
  const codeData = await getOrRotateAccessCode();
  return {
    success: true,
    code: codeData.code,
    type: codeData.type,
    expiresAt: codeData.expiresAt,
    version: codeData.version,
  };
});

/**
 * Cloud Function: generateAccessCode
 * Admin-only: Immediately generates a new random 6-digit code and invalidates the old one.
 */
exports.generateAccessCode = functions.https.onCall(async (data, context) => {
  await verifyIsAdmin(context);
  const newCode = generateRandom6Digit();
  const nextExpiry = getNext12PmIST();

  const codeRef = db.collection("settings").doc("accessCode");
  const doc = await codeRef.get();
  const currentVersion = doc.exists && doc.data().version ? doc.data().version : 0;

  const newDoc = {
    code: newCode,
    type: "random",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(nextExpiry),
    updatedBy: context.auth.uid,
    version: currentVersion + 1,
  };

  await codeRef.set(newDoc);

  return {
    success: true,
    code: newCode,
    type: "random",
    expiresAt: nextExpiry.toISOString(),
    version: newDoc.version,
    message: "New random code generated successfully.",
  };
});

/**
 * Cloud Function: setAccessCode
 * Admin-only: Sets a custom code chosen by the admin and invalidates the old one.
 */
exports.setAccessCode = functions.https.onCall(async (data, context) => {
  await verifyIsAdmin(context);
  const customCode = (data && data.code ? String(data.code).trim() : "");

  if (!customCode || customCode.length < 4 || customCode.length > 10) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Custom code must be between 4 and 10 characters."
    );
  }

  const nextExpiry = getNext12PmIST();
  const codeRef = db.collection("settings").doc("accessCode");
  const doc = await codeRef.get();
  const currentVersion = doc.exists && doc.data().version ? doc.data().version : 0;

  const newDoc = {
    code: customCode,
    type: "custom",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(nextExpiry),
    updatedBy: context.auth.uid,
    version: currentVersion + 1,
  };

  await codeRef.set(newDoc);

  return {
    success: true,
    code: customCode,
    type: "custom",
    expiresAt: nextExpiry.toISOString(),
    version: newDoc.version,
    message: "Custom access code saved successfully.",
  };
});
