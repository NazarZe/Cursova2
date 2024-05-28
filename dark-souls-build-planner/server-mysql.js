// server-mysql.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'dark_souls_db'
});

connection.connect();

app.get('/api/classes', (req, res) => {
  connection.query('SELECT * FROM classes', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/weapons', (req, res) => {
  connection.query('SELECT * FROM weapons', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/armor', (req, res) => {
  connection.query('SELECT * FROM armor', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/rings', (req, res) => {
  connection.query('SELECT * FROM rings', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
