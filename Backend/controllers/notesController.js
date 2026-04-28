// controllers/notesController.js
const db = require("../config/db");

// GET /notes - get all notes for logged-in user
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.sub; // FIXED

    const [rows] = await db.query(
      "SELECT * FROM notes WHERE cognito_user_id = ? ORDER BY pinned DESC, created_at DESC",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// POST /notes - create a new note
exports.createNote = async (req, res) => {
  try {
    const userId = req.user.sub; // FIXED
    const { title, content, color, pinned, archived, tags } = req.body;

    const [result] = await db.query(
      `INSERT INTO notes (title, content, color, pinned, archived, tags, cognito_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title || "",
        content || "",
        color || "purple",
        pinned ? 1 : 0,
        archived ? 1 : 0,
        tags || null,
        userId,
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND cognito_user_id = ?",
      [result.insertId, userId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
};

// PUT /notes/:id - update a note (only if owned by user)
exports.updateNote = async (req, res) => {
  try {
    const userId = req.user.sub; // FIXED
    const noteId = req.params.id;
    const { title, content, color, pinned, archived, tags } = req.body;

    const [result] = await db.query(
      `UPDATE notes
       SET title = ?, content = ?, color = ?, pinned = ?, archived = ?, tags = ?
       WHERE id = ? AND cognito_user_id = ?`,
      [
        title || "",
        content || "",
        color || "purple",
        pinned ? 1 : 0,
        archived ? 1 : 0,
        tags || null,
        noteId,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    const [rows] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND cognito_user_id = ?",
      [noteId, userId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
};

// DELETE /notes/:id - delete a note (only if owned by user)
exports.deleteNote = async (req, res) => {
  try {
    const userId = req.user.sub; // FIXED
    const noteId = req.params.id;

    const [result] = await db.query(
      "DELETE FROM notes WHERE id = ? AND cognito_user_id = ?",
      [noteId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};
