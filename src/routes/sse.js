const express = require('express');
const router = express.Router();

const { sseHandler } = require('../controllers/sseController');

// Endpoint: /api/stream/
router.get('/', sseHandler);


module.exports = router;
