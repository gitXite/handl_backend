const express = require('express');
const router = express.Router();

const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

// /api/lists/
router.get('/', authMiddleware.isAuthenticated, listController.getLists);
router.post('/', authMiddleware.isAuthenticated, listController.createList);
router.delete('/:listId', authMiddleware.isAuthenticated, listController.deleteList);

// router.post('/:listId/share', authMiddleware.isAuthenticated, listController.someFunction);
// router.delete('/:listId/unshare', authMiddleware.isAuthenticated, listController.someFunction);

// router.get('/:listId/items', authMiddleware.isAuthenticated, listController.fetchItems);
// router.post('/:listId/items', authMiddleware.isAuthenticated, listController.someFunction);
// router.patch('/:listId/items/:itemId', authMiddleware.isAuthenticated, listController.someFunction);
// router.delete('/:listId/items/:listId', authMiddleware.isAuthenticated, listController.someFunction);


module.exports = router;
