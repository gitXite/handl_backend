const bcrypt = require('bcrypt');
const pool = require('../config/db');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// Authorization service helper functions
// Check if the user already exists
const checkIfUserExists = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows.length > 0;
    } catch (error) {
        throw new Error('Database error during existence check');
    }
};
// Hash the user password
const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};
// Email token generation
const storeEmailToken = async (newUser) => {
    const token = crypto.randomBytes(32).toString('hex');
    await pool.query('UPDATE users SET email_token = $1 WHERE id = $2', [token, newUser.id]);
    return token;
};

// Main register service function
// Register and store the user on the database
const registerUser = async (name, email, password) => {
    const client = await pool.connect(); // Get a client for the transaction
    try {
        await client.query('BEGIN'); // Start a transaction

        // Check if the user already exists
        const userExists = await checkIfUserExists(email);
        if (userExists) {
            throw new Error('Account already exists');
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
        const token = storeEmailToken(newUser);

        // Send confirmation email
        await emailService.sendConfirmationEmail(email, token);

        // Commit the transaction
        await client.query('COMMIT');

        return newUser;
    } catch (error) {
        // Roll back transaction if an error occurs
        console.error('Error registering user in db, rolling back:', error);
        await client.query('ROLLBBACK');
        throw new Error(`Error during registration: ${error.message}`);
    } finally {
        // Release the client back to the pool
        client.release();
    }
};

// Login to be used in passport.js configuration
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
const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

// Email confirmation
// Verify user token
const verifyUserByToken = async (token) => {
    const result = await pool.query('SELECT id FROM users WHERE email_token = $1 AND email_verified = false', [token]);

    if (result.rowCount === 0) return null;

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
};
