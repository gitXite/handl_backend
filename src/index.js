const express = require('express');
const pool = require('./db/db');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());


app.get('/api/shopping_lists', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shopping_lists');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
