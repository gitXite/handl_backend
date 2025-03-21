const listService = require('../services/listService');
const ApiError = require('../utils/ApiError');


const getLists = async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const lists = await listService.getUserLists(req.user.id);
        res.status(200).json(lists);
    } catch (error) {
        console.error('Error fetching lists:', error);
        if (error instanceOf ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to retrieve lists' });
    }
};

const createList = async (req, res) => {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'List name is required' });
    }
    
    try {
        const newList = await listService.createList(req.user.id, name);
        res.status(201).json(newList);
    } catch (error) {
        console.error('Error creating list:', error);
        if (error instanceOf ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to create list' });
    }
};

const deleteList = async (req, res) => {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    
    const { listId } = req.params;
    try {
        const deletedList = await listService.deleteList(req.user.id, listId);
        if (!deletedList) {
            return res.status(404).json({ message: 'List to be deleted not found' });
        }
        res.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error('Error deleting list:', error);
        if (error instanceOf ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to delete list' });
    }
};


const getItems = async (req, res) => {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { listId } = req.params;
    try {
        const items = await listService.getListItems(listId, req.user.id);
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        if (error instanceOf ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to get items' });
    }
};

const addItem = async (req, res) => {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { listId } = req.params;
    const { name, quantity } = req.body;
    if (!name || quantity === 0) {
        return res.status(400).json({ message: 'Item name and quantity are required' });
    }

    try {
        const newItem = await listService.addItemToList(listId, req.user.id, name, quantity);
        if (!newItem) {
            return res.status(403).json({ message: 'Not authorized to add items to this list' });
        }

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error adding item:', error);
        if (error instanceOf ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to add item' });
    }
};

const updateItem = async (req, res) => {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { itemId } = req.params;
    const { name, quantity } = req.body;
    if (!name || quantity == null) {
        return res.status(400).json({ message: 'Item name and quantity are required' });
    }

    try {
        const updatedItem = await listService.updateItem(itemId, req.user.id, name, quantity);
        if (!updatedItem) {
            return res.status(403).json({ message: 'Not authorized to update this item' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        if (error instanceOf ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update item' });
    }
};

const deleteItem = async (req, res) => {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { itemId } = req.params;
    try {
        const deletedItem = await listService.deleteItem(itemId, req.user.id);
        if (!deletedItem) {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        if (error instanceOf ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to delete item' });
    }
};


module.exports = {
    getLists, 
    createList,
    deleteList,
    getItems,
    addItem,
    updateItem,
    deleteItem,
};
