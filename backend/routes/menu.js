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

// GET all menu items
router.get('/', (req, res) => {
    db.query('SELECT * FROM menu', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET single menu item
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM menu WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// POST add new menu item
router.post('/', (req, res) => {
    const { name, category, price, description, is_available } = req.body;
    db.query('INSERT INTO menu (name, category, price, description, is_available) VALUES (?, ?, ?, ?, ?)',
        [name, category, price, description, is_available], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Menu item added!', id: results.insertId });
        });
});

// PUT update menu item
router.put('/:id', (req, res) => {
    const { name, category, price, description, is_available } = req.body;
    db.query('UPDATE menu SET name=?, category=?, price=?, description=?, is_available=? WHERE id=?',
        [name, category, price, description, is_available, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Menu item updated!' });
        });
});

// DELETE menu item
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM menu WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Menu item deleted!' });
    });
});

module.exports = router; 
