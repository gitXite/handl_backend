const bcrypt = require('bcrypt');
const pool = require('../config/db');
const crypto = require('crypto');
const emailService = require('../services/emailService');
const ApiError = require('../utils/ApiError');

// Authorization service helper functions used in registerUser
// Validate password
const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
        password.length < minLength ||
        !hasUpperCase || 
        !hasLowerCase ||
        !hasNumber ||
        !hasSpecialChar
    ) {
        return false;
    }
    return true;
};
// Check if the user already exists
const checkIfUserExists = async (client, email) => {
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows.length > 0;
    } catch (error) {
        throw new ApiError(500, 'Database error during existence check');
    }
};
// Hash the user password
const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw new ApiError(500, 'Error hashing password');
    }
};
// Generate email token and store on db
const storeEmailToken = async (client, newUser) => {
    const token = crypto.randomBytes(32).toString('hex');
    console.log('Generated token:', token);
    try {
        const result = await client.query('UPDATE users SET email_token = $1 WHERE id = $2', [token, newUser.id]);
        console.log('Rows affected:', result.rowCount);
        return token;
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
};

// Main register service function
// Register and store the user on the database
const registerUser = async (name, email, password) => {
    const client = await pool.connect(); // Get a client for the transaction
    try {
        await client.query('BEGIN'); // Start a transaction

        // Check if the user already exists
        const userExists = await checkIfUserExists(client, email);
        if (userExists) {
            throw new ApiError(400, 'Account already exists');
        }
        // Check password validation
        if (!validatePasswordStrength(password)) {
            throw new ApiError(400, 'Password does not meet the required criteria.');
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Register the user
        const insertResult = await client.query(
            'INSERT INTO users (name, email, password, email_token, email_verified) VALUES ($1, $2, $3, NULL, false) RETURNING id, name, email', 
            [name, email, hashedPassword]
        );
        const newUser = insertResult.rows[0];

        // Store email token
        const token = await storeEmailToken(client, newUser);

        // Send confirmation email
        await emailService.sendConfirmationEmail(email, token);

        // Commit the transaction
        await client.query('COMMIT');

        return newUser;
    } catch (error) {
        // Roll back transaction if an error occurs
        await client.query('ROLLBACK');
        console.error('Error registering user in db, rolling back:', error);

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, 'Database error');
    } finally {
        // Release the client back to the pool
        client.release();
    }
};

// Login to be used in passport.js configuration, which is then used in controller
// Validate password during login
const validatePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};
// Fetch user by email
const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};
// Deserialize the user
const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

// Email confirmation
// Verify user token
const verifyUserByToken = async (token) => {
    const result = await pool.query('SELECT id FROM users WHERE email_token = $1 AND email_verified = false', [token]);

    if (result.rowCount === 0) {
        console.log('No user found or already verified');
        return null;
    }

    await pool.query('UPDATE users SET email_verified = true, email_token = NULL WHERE id = $1', [result.rows[0].id]);

    return result.rows[0].id;
};


module.exports = {
    checkIfUserExists,
    hashPassword,
    registerUser,
    validatePassword,
    getUserByEmail,
    getUserById,
    storeEmailToken,
    verifyUserByToken,
    validatePasswordStrength,
};
