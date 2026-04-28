// controllers/calendarController.js
const db = require("../config/db");

// GET /calendar - get all events for logged-in user
exports.getEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM calendar_events WHERE cognito_user_id = ? ORDER BY start_datetime ASC",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// POST /calendar - create a new event
exports.createEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      start_datetime,
      end_datetime,
      all_day,
      location,
      color,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO calendar_events
       (title, description, start_datetime, end_datetime, all_day, location, color, cognito_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title || "",
        description || "",
        start_datetime, // expect ISO string from frontend
        end_datetime || null,
        all_day || false,
        location || null,
        color || null,
        userId,
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM calendar_events WHERE id = ? AND cognito_user_id = ?",
      [result.insertId, userId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// PUT /calendar/:id - update event
exports.updateEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;
    const {
      title,
      description,
      start_datetime,
      end_datetime,
      all_day,
      location,
      color,
    } = req.body;

    const [result] = await db.query(
      `UPDATE calendar_events
       SET title = ?, description = ?, start_datetime = ?, end_datetime = ?, all_day = ?, location = ?, color = ?
       WHERE id = ? AND cognito_user_id = ?`,
      [
        title || "",
        description || "",
        start_datetime,
        end_datetime || null,
        all_day || false,
        location || null,
        color || null,
        eventId,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const [rows] = await db.query(
      "SELECT * FROM calendar_events WHERE id = ? AND cognito_user_id = ?",
      [eventId, userId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// DELETE /calendar/:id - delete event
exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    const [result] = await db.query(
      "DELETE FROM calendar_events WHERE id = ? AND cognito_user_id = ?",
      [eventId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};
