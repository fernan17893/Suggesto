const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // You can optionally add more configuration here if needed
});

const db = admin.firestore();

// Example function to save user preferences
async function saveUserPreferences(userId, preferences) {
  await db.collection('users').doc(userId).set({ preferences }, { merge: true });
}

module.exports = {
  saveUserPreferences,
  // Add more functions here as needed
};
