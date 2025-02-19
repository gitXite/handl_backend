const express = require('express');
const router = express.Router();


router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({message: 'Not logged in'});
    }
    res.status(200).json({message: 'Welcome to your profile', user: req.user});
});


module.exports = router;
