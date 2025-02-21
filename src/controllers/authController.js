const authService = require('../services/authService');

// Controllers for authorization
//
// Controller to register user
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

        // Return success response
        return res.status(201).json({ message: 'User registered successfully', newUser });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    registerUser
};
