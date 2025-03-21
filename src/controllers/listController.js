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
    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
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
    if (!req.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
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


module.exports = {
    getLists, 
    createList,
    deleteList,
};
