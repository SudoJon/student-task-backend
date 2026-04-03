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

    const query = "SELECT * FROM tasks ORDER BY id DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};

// CREATE a task (Flexible)
exports.createTask = (req, res) => {
    console.log("POST /tasks");

    const { 
        title, 
        description = null, 
        completed = 0, 
        status = "todo", 
        priority = "medium", 
        due_date = null, 
        notes = null 
    } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const query = `
        INSERT INTO tasks 
        (title, description, completed, status, priority, due_date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title,
        description,
        completed,
        status,
        priority,
        due_date,
        notes
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error creating task:", err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({
            message: "Task created",
            taskId: result.insertId
        });
    });
};

// UPDATE a task (Flexible)
exports.updateTask = (req, res) => {
    console.log(`PUT /tasks/${req.params.id}`);

    const { id } = req.params;
    const { title, description, completed, status, priority, due_date, notes } = req.body;

    const query = `
        UPDATE tasks 
        SET 
            title = COALESCE(?, title),
            description = COALESCE(?, description),
            completed = COALESCE(?, completed),
            status = COALESCE(?, status),
            priority = COALESCE(?, priority),
            due_date = COALESCE(?, due_date),
            notes = COALESCE(?, notes)
        WHERE id = ?
    `;

    const values = [
        title,
        description,
        completed,
        status,
        priority,
        due_date,
        notes,
        id
    ];

    db.query(query, values, (err, result) => {
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

