const fs = require('fs');
const util = require('util');

// Log to file
const logFile = fs.createWriteStream('/home/ec2-user/node-app.log', { flags: 'a' });
const logStdout = process.stdout;

console.log = function (msg) {
  logFile.write(new Date().toISOString() + " " + msg + '\n');
  logStdout.write(msg + '\n');
};

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(`
    <h1>Student Tasks API</h1>
    <p>This backend is running on EC2 and connected to RDS.</p>
    <p>Try the API endpoint: <a href="/tasks">/tasks</a></p>
  `);
});

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Routes
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
