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

// GET all staff
router.get('/', (req, res) => {
    db.query('SELECT * FROM staff', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET single staff
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM staff WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// POST add new staff
router.post('/', (req, res) => {
    const { name, role, phone, email, salary, joining_date } = req.body;
    db.query('INSERT INTO staff (name, role, phone, email, salary, joining_date) VALUES (?, ?, ?, ?, ?, ?)',
        [name, role, phone, email, salary, joining_date], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Staff added!', id: results.insertId });
        });
});

// PUT update staff
router.put('/:id', (req, res) => {
    const { name, role, phone, email, salary, status } = req.body;
    db.query('UPDATE staff SET name=?, role=?, phone=?, email=?, salary=?, status=? WHERE id=?',
        [name, role, phone, email, salary, status, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Staff updated!' });
        });
});

// DELETE staff
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM staff WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Staff deleted!' });
    });
});

module.exports = router; 
