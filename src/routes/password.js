const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');


// Routes for forgot password
router.post('/forgot-password', passwordController.forgotPassword);

// Routes for reset password
router.post('/reset-password', passwordController.resetPassword);


module.exports = router;
