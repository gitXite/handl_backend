const pool = require('../config/db');
const authService = require('../services/authService');
const passwordService = require('../services/passwordService');
const emailService = require('../services/emailService');
const ApiError = require('../utils/ApiError');


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const userExists = await authService.checkIfUserExists(pool, email);
        if (!userExists) {
            return res.status(404).json({ message: 'No registered user with this email.' });
        }
        const user = await authService.getUserByEmail(email);

        const passwordToken = await passwordService.storePasswordToken(user);
        if (!passwordToken) {
            return res.status(404).json({ message: 'No token found' });
        }

        await emailService.sendPasswordToken(passwordToken, email);
        res.status(200).json({ message: 'Success, check your email to reset password!' });
    } catch (error) {
        console.error('Error in passwordController:', error);
        res.status(500).json({ message: 'Failed to submit email, please try again.' });
    }
};

const validateResetToken = async (req, res) => {
    const { token } = req.query;

    try {
        await passwordService.validatePasswordToken(token);
        res.status(200).json({ message: 'Proceed to reset password' });
    } catch (error) {
        console.error('Error validating password reset token:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

const resetPassword = async (req, res) => {
    const { newPassword, token } = req.body;

    try {
        const userId = await passwordService.validatePasswordToken(token);
        await passwordService.updatePassword(newPassword, userId);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    forgotPassword,
    validateResetToken,
    resetPassword,
};
