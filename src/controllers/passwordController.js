import authService from '../services/authService';
import passwordService from '../services/passwordService';


const forgotPassword = async (req, res) => {
    const email = req.body;
    try {
        const userExists = await authService.checkIfUserExists(pool, email);
        if (!userExists) {
            return res.status(404).json({ message: 'No registered user with this email.' });
        }
        const user = await authService.getUserByEmail(email);

        const passwordToken = await passwordService.storePasswordToken(user);
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit email, please try again.' });
    }
};
