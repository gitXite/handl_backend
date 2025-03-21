const express = require('express');
const router = express.Router();

const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint: /api/lists/
router.get('/', authMiddleware.isAuthenticated, listController.getLists);
router.post('/', authMiddleware.isAuthenticated, listController.createList);
router.delete('/:listId', authMiddleware.isAuthenticated, listController.deleteList);

router.post('/:listId/share', authMiddleware.isAuthenticated, listController.shareList);
router.get('/listId/shared-users', authMiddleware.isAuthenticated, listController.getSharedUsers);
// router.delete('/:listId/unshare', authMiddleware.isAuthenticated, listController.someFunction);

router.get('/:listId/items', authMiddleware.isAuthenticated, listController.getItems);
router.post('/:listId/items', authMiddleware.isAuthenticated, listController.addItem);
router.patch('/:listId/items/:itemId', authMiddleware.isAuthenticated, listController.updateItem);
router.delete('/:listId/items/:listId', authMiddleware.isAuthenticated, listController.deleteItem);


module.exports = router;
