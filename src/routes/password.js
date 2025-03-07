const express = require('express');
const router = express.Router();


// Routes for forgot password
router.get('/forgot-password');
router.post('/forgot-password');

// Routes for reset password
router.get('/reset-password');
router.post('/reset-password');


module.exports = router;
