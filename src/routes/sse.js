const express = require('express');
const router = express.Router();

const { sseHandler } = require('../controllers/sseController');


router.get('/', sseHandler); // clients must send ?listId=xxx


module.exports = router;
