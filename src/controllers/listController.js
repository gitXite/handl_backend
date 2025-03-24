const listService = require('../services/listService');
const ApiError = require('../utils/ApiError');
const { broadcastEvent } = require('./sseController');


const getLists = async (req, res) => {
    try {
        const lists = await listService.getUserLists(req.user.id);
        res.status(200).json(lists);
    } catch (error) {
        console.error('Error fetching lists:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to retrieve lists' });
    }
};

const getListName = async (req, res) => {
    const { listId } = req.params;
    try {
        const listName = await listService.getListNameById(listId);
        res.status(200).json({ name: listName })
    } catch (error) {
        console.error('Error retrieving list name:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({error: error.message });
        }
        res.status(500).json({ error: 'Failed to retrieve list name' });
    }
};

const createList = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'List name is required' });
    }
    
    try {
        const newList = await listService.createList(req.user.id, name);
        console.log('New list created:', name);
        res.status(201).json(newList);
    } catch (error) {
        console.error('Error creating list:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to create list' });
    }
};

const renameList = async (req, res) => {
    const { name, listId } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'List name is required' });
    }

    try {
        const renamedList = await listService.renameList(req.user.id, listId, name);
        if (!renamedList) {
            return res.status(404).json({ message: 'List to rename not found' });
        }
        console.log('List renamed to:', name);
        res.status(200).json({ message: 'List renamed successfully', renamedList });
    } catch (error) {
        console.error('Error renaming list:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to rename list' });
    }
};

const deleteList = async (req, res) => {
    const { listId } = req.params;
    try {
        const deletedList = await listService.deleteList(req.user.id, listId);
        if (!deletedList) {
            return res.status(404).json({ message: 'List to be deleted not found' });
        }
        console.log('List deleted:', deletedList.name);

        broadcastEvent({
            type: 'LIST_DELETED',
            list: deletedList,
            listId: listId,
        });

        res.status(200).json({ message: 'List deleted successfully', listId});
    } catch (error) {
        console.error('Error deleting list:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to delete list' });
    }
};


const getItems = async (req, res) => {
    const { listId } = req.params;
    try {
        const items = await listService.getListItems(listId, req.user.id);
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to get items' });
    }
};

const addItem = async (req, res) => {
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

        broadcastEvent({
            type: 'ITEM_ADDED',
            item: newItem,
            listId: listId,
            createdBy: req.user.id,
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error adding item:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to add item' });
    }
};

const updateItem = async (req, res) => {
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

        broadcastEvent({
            type: 'ITEM_UPDATED',
            item: updatedItem,
            listId: updatedItem.list_id,
            updatedBy: req.user.id,
        });

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update item' });
    }
};

const deleteItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        const deletedItem = await listService.deleteItem(itemId, req.user.id);
        if (!deletedItem) {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        broadcastEvent({
            type: 'ITEM_DELETED',
            item: deletedItem,
            listId: deletedItem.list_id,
            deletedBy: req.user.id,
        });

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to delete item' });
    }
};


const shareList = async (req, res) => {
    const { listId } = req.params;
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const sharedList = await listService.shareList(listId, req.user.id, email);
        if (!sharedList) {
            return res.status(403).json({ message: 'You are not authorized to share this list or user does not exist' });
        }

        broadcastEvent({
            type: 'LIST_SHARED',
            list: sharedList,
            recipient: email,
        });

        res.status(200).json({ message: 'List shared successfully', list: sharedList });
    } catch (error) {
        console.error('Error sharing list:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to share list' });
    }
};

const getSharedUsers = async (req, res) => {
    const { listId } = req.params;
    try {
        const users = await listService.getSharedUsers(listId, req.user.id);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching shared users:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to retrieve shared users' });
    }
};

const removeSharedUser = async (req, res) => {
    const { listId, targetUserId } = req.params;
    try {
        const removedList = await listService.removeSharedUser(listId, req.user.id, targetUserId);
        if (!removedList) {
            return res.status(403).json({ message: 'You are not authorized to remove this user or no such share exists' });
        }

        broadcastEvent({
            type: 'USER_REMOVED',
            list: removedList,
            listId: listId,
            recipient: removedList.user_id,
        })

        res.status(200).json({ message: 'Shared user removed successfully', removedList });
    } catch (error) {
        console.error('Error removing shared user:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to remove shared user' });
    }
};


module.exports = {
    getLists, 
    getListName,
    createList,
    renameList,
    deleteList,
    getItems,
    addItem,
    updateItem,
    deleteItem,
    shareList,
    getSharedUsers,
    removeSharedUser,
};
