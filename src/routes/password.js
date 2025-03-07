const express = require('express');
const router = express.Router();


// Routes for forgot password
router.get('/forgot');
router.post('/forgot');

// Routes for reset password
router.get('/reset');
router.post('/reset');


module.exports = router;