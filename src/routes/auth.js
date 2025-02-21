const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const pool = require('../db/db');
const router = express.Router();


// Register api route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Account already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        const newUser = result.rows[0];
        console.log('New user created:', newUser);
        res.status(201).json({ message: 'User registered successfully', newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

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
