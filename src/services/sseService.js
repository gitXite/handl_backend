const pool = require('../config/db');


const getSharedListsForUser = async (userId) => {
    try {
        const { rows } = await pool.query(
            `SELECT l.id, l.name 
             FROM lists l 
             JOIN shared_lists s ON l.id = s.list_id 
             WHERE s.user_id = $1`,
            [userId]
        );

        return rows; // Returns [{ id: 1, name: "Groceries" }, ...]
    } catch (error) {
        console.error("Error retrieving shared lists for user:", error);
        return [];
    }
};


module.exports = { getSharedListsForUser }
