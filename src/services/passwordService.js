const pool = require('../config/db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


const storePasswordToken = async (user) => {
    const passwordToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(passwordToken, 10);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // One hour
    try {
        const result = await pool.query('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [user.id, hashedToken, expiresAt]);
        console.log('Rows affected:', result.rowCount);
        return passwordToken;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

// validatePasswordToken


module.exports = {
    storePasswordToken,
    validatePasswordToken,
};
