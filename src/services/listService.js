const pool = require('../config/db');
const ApiError = require('../utils/ApiError');


const getUserLists = async (userId) => {
    try {
        const ownedLists = await pool.query('SELECT * FROM lists WHERE owner_id = $1', [userId]);
        const sharedLists = await pool.query('SELECT lists.* FROM lists JOIN shared_lists ON lists.id = shared_lists.list_id WHERE shared_lists.user_id = $1', [userId]);
        return [...ownedLists.rows, ...sharedLists.rows];
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to retrieve lists from database');
    }
};

const getListNameById = async (listId) => {
    try {
        const result = await pool.query('SELECT name FROM lists WHERE id = $1', [listId]);
        if (result.rows.length === 0) {
            throw new ApiError(404, 'List not found');
        }
        return result.rows[0].name;
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to get name of list');
    }
};

const createList = async (userId, name) => {
    try {
        const result = await pool.query('INSERT INTO lists (owner_id, name) VALUES ($1, $2) RETURNING *', [userId, name]);
        return result.rows[0];
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to create list in database');
    }
};

const renameList = async (userId, listId, name) => {
    try {
        const result = await pool.query(
            `UPDATE lists SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING name`,
            [name, listId, userId]
        );
        if (result.rowCount === 0) {
            throw new ApiError(404, 'List not found or user is not the owner');
        }
        return result.rows[0].name;
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to rename list in database');
    }
};

const deleteList = async (userId, listId) => {
    try {
        const result = await pool.query('DELETE FROM lists WHERE id = $1 AND owner_id = $2 RETURNING *', [listId, userId]);
        return result.rows[0];
    } catch (error) {
        console.error('Database error in service layer:');
        throw new ApiError(500, 'Failed to delete list in database');
    }
};


const getListItems = async (listId, userId) => {
    try {
        const result = await pool.query(
            `SELECT items.* 
            FROM items 
            JOIN lists ON items.list_id = lists.id
            LEFT JOIN shared_lists ON lists.id = shared_lists.list_id
            WHERE items.list_id = $1
            AND (lists.owner_id = $2 OR shared_lists.user_id = $2)`, 
            [listId, userId]
        );
        return result.rows;
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to retrieve items');
    }
};

const addItemToList = async (listId, userId, name, quantity) => {
    try {
        const listCheck = await pool.query(
            `SELECT 1 FROM lists
            LEFT JOIN shared_lists ON lists.id = shared_lists.list_id
            WHERE lists.id = $1 AND (lists.owner_id = $2 OR shared_lists.user_id = $2`,
            [listId, userId]
        );
        if (listCheck.rowCount === 0) return null;
        const result = await pool.query(
            `INSERT INTO items (list_id, name, quantity) VALUES ($1, $2, $3) RETURNING *`,
            [listId, name, quantity]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to add item');
    }
};

const updateItem = async (itemId, userId, name, quantity) => {
    try {
        const result = await pool.query(
            `UPDATE items
            SET name = $1, quantity = $2
            WHERE id = $3
            AND list_id IN (
                SELECT lists.id FROM lists
                LEFT JOIN shared_lists ON lists.id = shared_lists.list_id
                WHERE lists.owner_id = $4 OR shared_lists.user_id = $4
            ) RETURNING *`,
            [name, quantity, itemId, userId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to update item');
    }
};

const deleteItem = async (itemId, userId) => {
    try {
        const result = await pool.query(
            `DELETE FROM items
            WHERE id = $1
            AND list_id IN (
                SELECT lists.id FROM lists
                LEFT JOIN shared_lists ON lists.id = shared_lists.list_id
                WHERE lists.owner_id = $2 OR shared_lists.user_id = $2
            ) RETURNING *`,
            [itemId, userId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to delete item');
    }
};


const shareList = async (listId, userId, email) => {
    try {
        // Existence check and owner
        const listCheck = await pool.query(
            `SELECT id FROM lists WHERE id = $1 AND owner_id = $2`,
            [listId, userId]
        );
        if (listCheck.rowCount === 0) return null;

        // Find recipient user by email
        const recipient = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        if (recipient.rowCount === 0) return null;

        const result = await pool.query(
            `INSERT INTO shared_lists (list_id, user_id) VALUES ($1, $2) RETURNING *`,
            [listId, recipient.rows[0].id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to share list');
    }
};

const getSharedUsers = async (listId, userId) => {
    try {
        // Check ownership or access
        const listCheck = await pool.query(
            `SELECT id FROM lists 
            WHERE id = $1 AND (owner_id = $2 OR EXISTS (
                SELECT 1 FROM shared_lists 
                WHERE shared_lists.list_id = $1 AND shared_lists.user_id = $2
            ))`,
            [listId, userId]
        );
        if (listCheck.rowCount === 0) return [];

        const sharedUsers = await pool.query(
            `SELECT users.id, users.email 
             FROM users 
             JOIN shared_lists ON users.id = shared_lists.user_id 
             WHERE shared_lists.list_id = $1`,
            [listId]
        );
        return sharedUsers.rows;
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to get shared users');
    }
};

const removeSharedUser = async (listId, userId, targetUserId) => {
    try {
        const listCheck = await pool.query(
            `SELECT id FROM lists WHERE id = $1 AND owner_id = $2`,
            [listId, userId]
        );
        if (listCheck.rowCount === 0) return null;

        const result = await pool.query(
            'DELETE FROM shared_lists WHERE list_id = $1 AND user_id = $2 RETURNING *',
            [listId, targetUserId]
        );
        if (result.rowCount === 0) return null;
        return result.rows[0];
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to remove shared user');
    }
};


module.exports = {
    getUserLists, 
    getListNameById,
    createList,
    renameList, 
    deleteList,
    getListItems,
    addItemToList,
    updateItem,
    deleteItem,
    shareList,
    getSharedUsers,
    removeSharedUser,
};
