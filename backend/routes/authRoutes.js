// /routes/authRoutes.js
const express = require('express');
const { loginUser } = require('../controllers/authController');

const router = express.Router();

// Login route (with Firebase token)
router.post('/login', loginUser);

module.exports = router;
