const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');


// Contact api route
router.post('/form', contactController.contactEmail);


module.exports = router;
