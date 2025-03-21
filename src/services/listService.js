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

const createList = async (userId, name) => {
    try {
        const result = await pool.query('INSERT INTO lists (owner_id, name) VALUES ($1, $2) RETURNING *', [userId, name]);
        return result.rows[0];
    } catch (error) {
        console.error('Database error in service layer:', error);
        throw new ApiError(500, 'Failed to create list in database');
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


module.exports = {
    getUserLists, 
    createList,
    deleteList,
};
