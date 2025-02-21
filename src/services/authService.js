const bcrypt = require('bcrypt');
const pool = require('../config.db');


// Services for register api route
const checkIfUserExists = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] > 0;
    } catch (error) {
        throw new Error('Database error during existence check');
    }
};

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

const registerUser = async (name, email, hashedPassword) => {
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email', 
            [name, email, hashedPassword]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Error registering user');
    }
};


module.exports = {
    checkIfUserExists,
    hashPassword,
    registerUser
};
