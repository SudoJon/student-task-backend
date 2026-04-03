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
    console.log("GET /tasks");

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
    console.log("POST /tasks");

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

// UPDATE a task
exports.updateTask = (req, res) => {
    console.log(`PUT /tasks/${req.params.id}`);

    const { id } = req.params;
    const { title, description, completed } = req.body;

    const query = "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?";
    db.query(query, [title, description, completed, id], (err, result) => {
        if (err) {
            console.error("Error updating task:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task updated successfully" });
    });
};

// DELETE a task
exports.deleteTask = (req, res) => {
    console.log(`DELETE /tasks/${req.params.id}`);

    const { id } = req.params;

    const query = "DELETE FROM tasks WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    });
};

