const express = require('express');
const router = express.Router();


// Profile api route
router.get('/profile', authMiddleware.isAuthenticated, authController.getProfile);


module.exports = router;
