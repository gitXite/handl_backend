const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const pool = require('../db/db');
const router = express.Router();


// Register route
router.post('/register', async (req, res) => {
    console.log('Register route hit');
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        const newUser = result.rows[0];
        console.log('New user created:', newUser);
        res.json({ message: 'User registered successfully', newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized', info });

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

// Logout route
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
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
});


module.exports = router;
