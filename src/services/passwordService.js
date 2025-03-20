const pool = require('../config/db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const ApiError = require('../utils/ApiError');
const authService = require('./authService');


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

const validatePasswordToken = async (token) => {
    try {
        const result = await pool.query('SELECT user_id, token, expires_at FROM password_reset_tokens');
        if (result.rowCount === 0) {
            throw new ApiError(404, 'No tokens found');
        }
        
        let userId = null;

        for (const row of result.rows) {
            const isMatch = await bcrypt.compare(token, row.token)
            if (isMatch) {
                userId = row.user_id;
                if (row.expires_at < new Date()) {
                    throw new ApiError(400, 'Token expired');
                }
                break;
            }
        }

        if (!userId) {
            throw new ApiError(400, 'Invalid token');
        }

        await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);
        return userId;
    } catch (error) {
        console.error('Error validating password reset token:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(500, 'Internal server error');
    }
};

const updatePassword = async (newPassword, userId) => {
    if (!authService.validatePasswordStrength(newPassword)) {
        throw new ApiError(400, 'Password does not meet the required criteria.');
    }
    const oldPassword = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    const isMatch = await bcrypt.compare(newPassword, oldPassword);
    if (isMatch) {
        throw new ApiError(400, 'New password cannot be the same as your old password');
    }

    try {
        const hashedPassword = await authService.hashPassword(newPassword);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
    } catch (error) {
        console.error('Error updating password in database:', error);
        throw new ApiError(500, 'Internal server error');
    }
};


module.exports = {
    storePasswordToken,
    validatePasswordToken,
    updatePassword,
};
