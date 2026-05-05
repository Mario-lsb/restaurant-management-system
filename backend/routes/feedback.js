const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// GET all feedback
router.get('/', (req, res) => {
    db.query(`SELECT f.*, c.name as customer_name 
              FROM feedback f 
              LEFT JOIN customers c ON f.customer_id = c.id`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST add feedback
router.post('/', (req, res) => {
    const { customer_id, order_id, rating, comments } = req.body;
    db.query('INSERT INTO feedback (customer_id, order_id, rating, comments) VALUES (?, ?, ?, ?)',
        [customer_id, order_id, rating, comments], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Feedback added!', id: results.insertId });
        });
});

// DELETE feedback
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM feedback WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Feedback deleted!' });
    });
});

module.exports = router; 
