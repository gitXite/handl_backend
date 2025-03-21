const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');

// Endpoint: /api/auth/
router.post('/register', authController.registerUser);

router.get('/confirm-email', authController.confirmEmail);

router.post('/login', authController.loginUser);

router.get('/session', sessionController.checkSession);

router.post('/logout', sessionController.logoutUser);


module.exports = router;
