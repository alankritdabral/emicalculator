const admin = require("firebase-admin");

// Initialize Firebase using service account from environment variable
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function getNext12AmIST() {
  const now = new Date();
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const istYear = istTime.getUTCFullYear();
  const istMonth = istTime.getUTCMonth();
  const istDate = istTime.getUTCDate();
  
  // 12:00 AM IST is 18:30:00 UTC of the current IST date.
  return new Date(Date.UTC(istYear, istMonth, istDate, 18, 30, 0, 0));
}

function generateRandom6Digit() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function resetAccessCode() {
  try {
    const codeRef = db.collection("settings").doc("accessCode");
    const doc = await codeRef.get();
    
    let currentVersion = 0;
    if (doc.exists) {
        const data = doc.data();
        currentVersion = data.version || 0;
    }

    const newCode = generateRandom6Digit();
    const nextExpiry = getNext12AmIST();
    
    const newDoc = {
      code: newCode,
      type: "random",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(nextExpiry),
      updatedBy: "github_actions_cron",
      version: currentVersion + 1,
    };
    
    await codeRef.set(newDoc);
    console.log(`Successfully reset access code to ${newCode}. Expires at ${nextExpiry.toISOString()}`);
    process.exit(0);
  } catch (error) {
    console.error("Error resetting access code:", error);
    process.exit(1);
  }
}

resetAccessCode();
