// /controllers/authController.js
const { signInUser } = require('../services/authService');

const loginUser = async (req, res) => {
  const { firebaseToken } = req.body; // Get Firebase token from the client-side

  if (!firebaseToken) {
    return res.status(400).json({ error: 'No Firebase token provided' });
  }

  try {
    const { jwtToken } = await signInUser(firebaseToken); // Authenticate using Firebase token and generate JWT
    res.json({ token: jwtToken }); // Send the JWT back to the client
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { loginUser };
