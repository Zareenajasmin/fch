// /services/authService.js
const admin = require('../config/firebaseConfig');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; // Get JWT_SECRET from environment variable

// Firebase Authentication (sign-in user)
const signInUser = async (firebaseToken) => {
  try {
    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const userUid = decodedToken.uid;

    // You can save additional user data to your database if needed (e.g., user model)

    // Create a JWT token for the user
    const jwtToken = jwt.sign({ userUid }, JWT_SECRET, { expiresIn: '1h' });

    return { jwtToken };
  } catch (error) {
    throw new Error('Firebase authentication failed');
  }
};

module.exports = { signInUser };
