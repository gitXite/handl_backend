const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');


// Endpoint: /api/password/
router.post('/forgot-password', passwordController.forgotPassword);

router.get('/reset-password', passwordController.validateResetToken);
router.post('/reset-password', passwordController.resetPassword);


module.exports = router;
