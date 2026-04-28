const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// Protect all settings routes
router.use(auth);

// Routes
router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

module.exports = router;
