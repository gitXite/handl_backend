const express = require('express');
const session = require('express-session');
require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const pool = require('./db/db');
const port = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// Parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            console.log('Login attempt for:', email);

            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                console.log('User not found');
                return done(null, false, { message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Incorrect password');
                return done(null, false, { message: 'Incorrect password' });
            }

            console.log('Login successful', user.name);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

// Store user ID in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// Retrieve user from ID
passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id =$1', [id]);
        const user = result.rows[0];
        done(null, user);
    } catch (error) {
        done(error);
    }
});


// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// Try/catch to connect to db and start server
async function startServer() {
    try {
        await pool.query('SELECT 1');
        console.log('Database connected successfully.');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1);
    }
}


startServer();