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

// GET all payments
router.get('/', (req, res) => {
    db.query(`SELECT p.*, o.order_type, c.name as customer_name 
              FROM payments p 
              LEFT JOIN orders o ON p.order_id = o.id 
              LEFT JOIN customers c ON o.customer_id = c.id`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET single payment
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM payments WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// POST add payment
router.post('/', (req, res) => {
    const { order_id, amount, payment_method, payment_status } = req.body;
    db.query('INSERT INTO payments (order_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?)',
        [order_id, amount, payment_method, payment_status || 'completed'], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Payment recorded!', id: results.insertId });
        });
});

// PUT update payment
router.put('/:id', (req, res) => {
    const { payment_status } = req.body;
    db.query('UPDATE payments SET payment_status=? WHERE id=?',
        [payment_status, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Payment updated!' });
        });
});

module.exports = router; 
