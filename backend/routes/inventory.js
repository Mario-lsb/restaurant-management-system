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

// GET all inventory
router.get('/', (req, res) => {
    db.query(`SELECT i.*, s.name as supplier_name 
              FROM inventory i 
              LEFT JOIN supplier s ON i.supplier_id = s.id`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET single inventory item
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM inventory WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// POST add inventory item
router.post('/', (req, res) => {
    const { item_name, quantity, unit, min_quantity, supplier_id } = req.body;
    db.query('INSERT INTO inventory (item_name, quantity, unit, min_quantity, supplier_id) VALUES (?, ?, ?, ?, ?)',
        [item_name, quantity, unit, min_quantity, supplier_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Inventory item added!', id: results.insertId });
        });
});

// PUT update inventory
router.put('/:id', (req, res) => {
    const { item_name, quantity, unit, min_quantity, supplier_id } = req.body;
    db.query('UPDATE inventory SET item_name=?, quantity=?, unit=?, min_quantity=?, supplier_id=? WHERE id=?',
        [item_name, quantity, unit, min_quantity, supplier_id, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Inventory updated!' });
        });
});

// DELETE inventory item
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM inventory WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Inventory item deleted!' });
    });
});

module.exports = router; 
