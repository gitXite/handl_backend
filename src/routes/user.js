const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');


// Protected profile api route
router.get('/profile', authMiddleware.isAuthenticated, authController.getProfile);


module.exports = router;
