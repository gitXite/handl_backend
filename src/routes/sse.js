const express = require('express');
const router = express.Router();

const { sseHandler } = require('../controllers/sseController');

// Endpoint: /api/events/
router.get('/', sseHandler);


module.exports = router;
