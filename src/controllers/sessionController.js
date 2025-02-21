const passport = require('passport');

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


module.exports = {
    checkSession,
}
