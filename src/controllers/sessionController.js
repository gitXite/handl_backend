

// Controllers for session management
//
// Check if session is authenticated
const checkSession = (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ isAuthenticated: true, user: req.name });
    } else {
        return res.json({ isAuthenticated: false });
    }
};

// Logout controller
const logoutUser = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(400).json({ message: 'No user logged in' });
    }

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error destroying session' });
        }

        res.clearCookie('connect.sid', { path: '/' });
        console.log('Logged out successfully');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};


module.exports = {
    checkSession,
    logoutUser,
}
