// backend/firebase-config.js
const admin = require('firebase-admin');

// Replace with your Firebase project's service account JSON file
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
