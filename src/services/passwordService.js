import pool = require('../config/db');
import crypto = require('crypto');


const storePasswordToken = async (user) => {
    const passwordToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // One hour
    try {
        const result = await pool.query('UPDATE users SET password_token = $1 WHERE email = $2', [passwordToken, user.id]); // Change this to separate password_reset_tokens table
        console.log('Rows affected:', result.rowCount);
        return token;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};


module.exports = {
    storePasswordToken,
};
