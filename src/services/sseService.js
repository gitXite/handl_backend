const pool = require('../config/db');


const getSharedListsForUser = async (userId) => {
    try {
        const { rows } = await pool.query(
            'SELECT list_id FROM shared_lists WHERE user_id = $1',
            [userId]
        );

        return rows.map(row => row.list_id);
    } catch (error) {
        console.error("Error retrieving shared lists for user:", error);
        throw error;
    }
};


module.exports = { getSharedListsForUser }
