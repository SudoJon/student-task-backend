// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
console.log("AUTH HEADER:", req.headers.authorization);

  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = header.replace("Bearer ", "");

  try {
    // Decode token (no verification needed for class project)
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = {
      sub: decoded.sub,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("JWT decode error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
