const authService = require('../services/authService');
const emailService = require('../services/emailService');
const passport = require('passport');

// Controllers for authorization
//
// Controller for user registration
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }

    try {
        // Check if user already exists
        const userExists = await authService.checkIfUserExists(email);
        if (userExists) {
            return res.status(400).json({ message: 'Account already exists' });
        }

        // Hash the password
        const hashedPassword = await authService.hashPassword(password);
        // Register the user
        const newUser = await authService.registerUser(name, email, hashedPassword);
        // Store token
        const token = await authService.storeEmailToken(newUser);

        // Send confirmation email
        await emailService.sendConfirmationEmail(email, token);

        // Return success response
        return res.status(201).json({ message: 'User registered successfully! Check your email for confirmation', newUser });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller for user login
const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) =>  {
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
    }(req, res, next);
};

// Get user profile
const getProfile = (req, res) => {
    res.status(200).json({ message: 'Welcome to your profile' });
};

// Email confirmation
const confirmEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ message: 'Invalid token' });

        const userId = await authService.verifyUserByToken(token);
        if (!userId) return res.status(400).json({ message: 'Invalid or expired token' });

        res.status(200).json({ message: 'Email confirmed! You can now log in' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getProfile,
    confirmEmail,
};
