const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// GET all tasks
exports.getTasks = (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};

// CREATE a task
exports.createTask = (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const query = "INSERT INTO tasks (title, description) VALUES (?, ?)";
    db.query(query, [title, description], (err, result) => {
        if (err) {
            console.error("Error creating task:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Task created", taskId: result.insertId });
    });
};
