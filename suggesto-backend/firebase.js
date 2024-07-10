// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Firestore doesn't require databaseURL
});

module.exports = admin;
