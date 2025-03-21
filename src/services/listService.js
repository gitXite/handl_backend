const pool = require('../config/db');


const getUserLists = async (userId) => {
    const ownedLists = await pool.query('SELECT * FROM lists WHERE owner_id = $1', [userId]);
    const sharedLists = await pool.query('SELECT lists.* FROM lists JOIN shared_lists ON lists.id = shared_lists.list_id WHERE shared_lists.user_id = $1', [userId]);

    return [...ownedLists.rows, ...sharedLists.rows];
};

const createList = async (userId, name) => {
    const result = await pool.query('INSERT INTO lists (owner_id, name) VALUES ($1, $2) RETURNING *', [userId, name]);
    return result.rows[0];
};

const deleteList = async (userId, listId) => {
    const result = await pool.query('DELETE FROM lists WHERE id = $1 AND owner_id = $2 RETURNING *', [listId, userId]);
    return result.rows[0];
};


module.exports = {
    getUserLists, 
    createList,
    deleteList,
};
