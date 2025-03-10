const authService = require('../services/authService');
const passwordService = require('../services/passwordService');


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const userExists = await authService.checkIfUserExists(pool, email);
        if (!userExists) {
            return res.status(404).json({ message: 'No registered user with this email.' });
        }
        const user = await authService.getUserByEmail(email);

        const passwordToken = await passwordService.storePasswordToken(user);
        if (passwordToken) {
            await emailService.sendPasswordToken(passwordToken, email);
        }
        res.status(200).json({ message: 'Success, check your email to reset password!' });
    } catch (error) {
        console.error('Error in passwordController:', error);
        res.status(500).json({ message: 'Failed to submit email, please try again.' });
    }
};

const resetPassword = async () => {
    // Logic here
};


module.exports = {
    forgotPassword,
};
