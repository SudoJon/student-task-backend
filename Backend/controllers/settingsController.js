// controllers/settingsController.js
const db = require("../config/db");

// GET /settings - get settings for logged-in user
exports.getSettings = async (req, res) => {
  try {
    const userId = req.user.sub; // FIXED

    const [rows] = await db.query(
      "SELECT * FROM settings WHERE cognito_user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      // return defaults if no row yet
      return res.json({
        theme: "light",
        font_size: "medium",
        notifications_enabled: 1, // FIXED
        accent_color: "purple",
        density: "comfortable",
        reduced_motion: 0, // FIXED
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

// PUT /settings - upsert settings for logged-in user
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.sub; // FIXED
    const {
      theme,
      font_size,
      notifications_enabled,
      accent_color,
      density,
      reduced_motion,
    } = req.body;

    // Try update first
    const [updateResult] = await db.query(
      `UPDATE settings
       SET theme = ?, font_size = ?, notifications_enabled = ?, accent_color = ?, density = ?, reduced_motion = ?
       WHERE cognito_user_id = ?`,
      [
        theme || "light",
        font_size || "medium",
        notifications_enabled !== undefined ? notifications_enabled : 1, // FIXED
        accent_color || "purple",
        density || "comfortable",
        reduced_motion !== undefined ? reduced_motion : 0, // FIXED
        userId,
      ]
    );

    if (updateResult.affectedRows === 0) {
      // No row yet → insert
      await db.query(
        `INSERT INTO settings
         (theme, font_size, notifications_enabled, accent_color, density, reduced_motion, cognito_user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          theme || "light",
          font_size || "medium",
          notifications_enabled !== undefined ? notifications_enabled : 1,
          accent_color || "purple",
          density || "comfortable",
          reduced_motion !== undefined ? reduced_motion : 0,
          userId,
        ]
      );
    }

    const [rows] = await db.query(
      "SELECT * FROM settings WHERE cognito_user_id = ?",
      [userId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ error: "Failed to update settings" });
  }
};
