const pool = require('../config/db');


const getUserBySharedLists = async (userId) => {
    try {
        // Query the database to find all lists this user has access to
        const { rows } = await pool.query(
            "SELECT list_id FROM shared_lists WHERE user_id = $1", 
            [userId]
        );
        return rows.map(row => row.list_id);
    } catch (error) {
        console.error("Error retrieving user lists:", error);
        throw error; // Propagate the error to be handled in the controller
    }
};


module.exports = { getUserBySharedLists }
