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
router.post('/logout', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(400).json({ message: 'No user logged in' });
    }
    
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error destroying session' });
        }
        res.clearCookie('connect.sid', { path: '/' });
        console.log('Logged out successfully');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});


module.exports = router;
