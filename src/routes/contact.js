const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');


// Endpoint: /api/contact/
router.post('/form', contactController.contactEmail);


module.exports = router;
