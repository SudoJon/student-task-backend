const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

/* ============================================================
   GET TASKS — now filtered by logged‑in user (req.user.id)
   ============================================================ */
exports.getTasks = (req, res) => {
    console.log("GET /tasks", req.query);

    const userId = req.user.id; //  Cognito user ID

    const { status, priority, due, search, sort, order } = req.query;

    let query = "SELECT * FROM tasks WHERE cognito_user_id = ?";
    const conditions = [];
    const values = [userId];

    // Status filter
    if (status) {
        conditions.push("status = ?");
        values.push(status);
    }

    // Priority filter
    if (priority) {
        conditions.push("priority = ?");
        values.push(priority);
    }

    // Due date filter
    if (due) {
        if (due === "today") {
            conditions.push("due_date = CURDATE()");
        } else if (due === "tomorrow") {
            conditions.push("due_date = CURDATE() + INTERVAL 1 DAY");
        } else if (due === "this_week") {
            conditions.push("due_date BETWEEN CURDATE() AND CURDATE() + INTERVAL 7 DAY");
        } else if (due === "overdue") {
            conditions.push("due_date < CURDATE()");
        } else if (due === "none") {
            conditions.push("due_date IS NULL");
        }
    }

    // Search filter
    if (search) {
        conditions.push("(title LIKE ? OR description LIKE ? OR notes LIKE ?)");
        const like = `%${search}%`;
        values.push(like, like, like);
    }

    // Apply extra conditions
    if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
    }

    // Sorting
    const allowedSort = ["due_date", "priority", "updated_at", "created_at", "title"];
    const allowedOrder = ["asc", "desc"];

    let sortColumn = "id";
    let sortDirection = "DESC";

    if (sort && allowedSort.includes(sort)) {
        sortColumn = sort;
    }

    if (order && allowedOrder.includes(order.toLowerCase())) {
        sortDirection = order.toUpperCase();
    }

    query += ` ORDER BY ${sortColumn} ${sortDirection}`;

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};

/* ============================================================
   CREATE TASK — attaches cognito_user_id to every new task
   ============================================================ */
exports.createTask = (req, res) => {
    console.log("POST /tasks");

    const userId = req.user.id; //  Cognito user ID

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
        (title, description, completed, status, priority, due_date, notes, cognito_user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title,
        description,
        completed,
        status,
        priority,
        due_date,
        notes,
        userId
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

/* ============================================================
   UPDATE TASK — only updates tasks owned by the user
   ============================================================ */
exports.updateTask = (req, res) => {
    console.log(`PUT /tasks/${req.params.id}`);

    const userId = req.user.id; //  Cognito user ID
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
        WHERE id = ? AND cognito_user_id = ?
    `;

    const values = [
        title,
        description,
        completed,
        status,
        priority,
        due_date,
        notes,
        id,
        userId
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating task:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found or not yours" });
        }

        res.json({ message: "Task updated successfully" });
    });
};

/* ============================================================
   DELETE TASK — only deletes tasks owned by the user
   ============================================================ */
exports.deleteTask = (req, res) => {
    console.log(`DELETE /tasks/${req.params.id}`);

    const userId = req.user.id; //  Cognito user ID
    const { id } = req.params;

    const query = "DELETE FROM tasks WHERE id = ? AND cognito_user_id = ?";

    db.query(query, [id, userId], (err, result) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found or not yours" });
        }

        res.json({ message: "Task deleted successfully" });
    });
};
