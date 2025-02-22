const bcrypt = require('bcrypt');
const pool = require('../config.db');
const crypto = require('crypto');

// Authorization service functions
// Register
// Check if the user already exists
const checkIfUserExists = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] > 0;
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
// Store the user on the database
const registerUser = async (name, email, hashedPassword) => {
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password, email_token, email_verified) VALUES ($1, $2, $3, NULL, false) RETURNING id, name, email', 
            [name, email, hashedPassword]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Error registering user');
    }
};

// Login
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

// Email confirmation
// Email token generation
const storeEmailToken = async (newUser) => {
    const token = crypto.randomBytes(32).toString('hex');
    await pool.query('UPDATE users SET email_token = $1 WHERE id = $2', [token, newUser]);
    return token;
};
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
    storeEmailToken,
    verifyUserByToken,
};
