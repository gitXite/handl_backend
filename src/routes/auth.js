const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');


// Register api route
router.post('/register', authController.registerUser);
// Confirm email api route
router.get('/confirm-email', authController.confirmEmail);

// Login api route
router.post('/login', authController.loginUser);

// Session api route
router.get('/session', sessionController.checkSession);

// Logout api route
router.post('/logout', sessionController.logoutUser);


module.exports = router;
