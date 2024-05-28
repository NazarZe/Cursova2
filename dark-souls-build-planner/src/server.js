const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// API endpoints
app.get('/api/classes', (req, res) => {
    fs.readFile(path.join(__dirname, 'public/classes.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading classes data');
        }
        res.send(JSON.parse(data));
    });
});

app.get('/api/weapons', (req, res) => {
    fs.readFile(path.join(__dirname, 'public/weapons.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading weapons data');
        }
        res.send(JSON.parse(data));
    });
});

app.get('/api/armor', (req, res) => {
    fs.readFile(path.join(__dirname, 'public/armor.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading armor data');
        }
        res.send(JSON.parse(data));
    });
});

app.get('/api/rings', (req, res) => {
    fs.readFile(path.join(__dirname, 'public/rings.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading rings data');
        }
        res.send(JSON.parse(data));
    });
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
