const { Pool } = require('pg');
require('dotenv').config();

// Schemas
// lists: id, name, owner_id, created_at
// shared_lists: id, list_id, user_id, created_at
// items: id, list_id, name, quantity, checked, created_at


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


module.exports = pool;
