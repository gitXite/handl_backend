const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const router = express.Router();
const authController = require('../controllers/authController');


// Register api route
router.post('/register', authController.registerUser);

// Login api route
router.post('/login', authController.loginUser);

// Session api route
router.get('/session', sessionController.checkSession);

// Logout api route
router.post('/logout', sessionController.logoutUser);


module.exports = router;
