const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authService = require('../services/authService');

// Passport local strategy
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            console.log('Login attempt for:', email);
            const user = await authService.getUserByEmail(email);

            if (!user) {
                console.log('Login failed: incorrect email');
                return done(null, false, { message: 'Invalid email or password' });
            }

            const isMatch = await authService.validatePassword(password, user.password);
            if (!isMatch) {
                console.log('Login failed: incorrect password');
                return done(null, false, { message: 'Invalid email or password' });
            }

            console.log('Login successful for:', user.name);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

// Store user ID in session
passport.serializeUser((user, done) => {
    console.log('Serializing User:', user.id);
    done(null, user.id);
});

// Retrieve user from ID
passport.deserializeUser(async (id, done) => {
    try {
        const user = await authService.getUserById(id);

        // if (!user) {
        //     return done(null, false);
        // }
        
        console.log('Deserializing User:', user);
        done(null, user);
    } catch (error) {
        console.error('Error deserializing user:', error);
        done(error, null);
    }
});

module.exports = passport;