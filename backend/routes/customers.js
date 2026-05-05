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

// GET all customers
router.get('/', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET single customer
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// POST add new customer
router.post('/', (req, res) => {
    const { name, phone, email, address } = req.body;
    db.query('INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
        [name, phone, email, address], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Customer added!', id: results.insertId });
        });
});

// PUT update customer
router.put('/:id', (req, res) => {
    const { name, phone, email, address } = req.body;
    db.query('UPDATE customers SET name=?, phone=?, email=?, address=? WHERE id=?',
        [name, phone, email, address, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Customer updated!' });
        });
});

// DELETE customer
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM customers WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Customer deleted!' });
    });
});

module.exports = router; 
