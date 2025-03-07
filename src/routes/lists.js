const express = require('express');
const router = express.Router();

const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');


// Get lists API route
// router.get('/', authMiddleware.isAuthenticated, listController.fetchLists);

// Get items in list API route
// router.get('/:id/items', authMiddleware.isAuthenticated, listController.fetchItems);


module.exports = router;
