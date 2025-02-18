const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('../db/db');

// Passport local strategy
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            console.log('Login attempt for:', email);
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                console.log('Invalid email or password');
                return done(null, false, { message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Incorrect password');
                return done(null, false, { message: 'Invalid email or password' });
            }

            console.log('Login successful', user.name);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

// Store user ID in session
passport.serializeUser((user, done) => done(null, user.id));

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
