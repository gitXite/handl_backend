const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const router = express.Router();
const authController = require('../controllers/authController');


// Register api route
router.post('/register', authController.registerUser);

// Login api route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Error during authentication' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message || 'Invalid credentials' });
        }
        if (req.isAuthenticated()) {
            return res.status(400).json({ message: 'Already logged in' });
        }

        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging in' });
            }
            
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

// Session api route
router.get('/session', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ isAuthenticated: true, user: req.name });
    } else {
        return res.json({ isAuthenticated: false });
    }
});

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
