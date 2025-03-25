const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');


// Endpoint: /api/user/
router.get('/profile/:userId', authMiddleware.isAuthenticated, authController.getProfile);


module.exports = router;
