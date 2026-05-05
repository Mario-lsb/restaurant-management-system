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

// GET all orders
router.get('/', (req, res) => {
    db.query(`SELECT o.*, c.name as customer_name, s.name as staff_name 
              FROM orders o 
              LEFT JOIN customers c ON o.customer_id = c.id 
              LEFT JOIN staff s ON o.staff_id = s.id`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET single order with items
router.get('/:id', (req, res) => {
    db.query(`SELECT o.*, c.name as customer_name, s.name as staff_name 
              FROM orders o 
              LEFT JOIN customers c ON o.customer_id = c.id 
              LEFT JOIN staff s ON o.staff_id = s.id 
              WHERE o.id = ?`, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// POST create new order
router.post('/', (req, res) => {
    const { customer_id, staff_id, total_amount, order_type, status } = req.body;
    db.query('INSERT INTO orders (customer_id, staff_id, total_amount, order_type, status) VALUES (?, ?, ?, ?, ?)',
        [customer_id, staff_id, total_amount, order_type, status || 'pending'], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Order created!', id: results.insertId });
        });
});

// PUT update order status
router.put('/:id', (req, res) => {
    const { status, total_amount, order_type } = req.body;
    db.query('UPDATE orders SET status=?, total_amount=?, order_type=? WHERE id=?',
        [status, total_amount, order_type, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Order updated!' });
        });
});

// DELETE order
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM orders WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order deleted!' });
    });
});

module.exports = router; 
