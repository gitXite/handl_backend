const express = require('express');
const router = express.Router();


// Profile api route
router.get('/profile', authController.getProfile);


module.exports = router;
