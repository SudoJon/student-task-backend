const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const auth = require('../middleware/auth');

// Protect all calendar routes
router.use(auth);

// Routes
router.get('/', calendarController.getEvents);
router.post('/', calendarController.createEvent);
router.put('/:id', calendarController.updateEvent);
router.delete('/:id', calendarController.deleteEvent);

module.exports = router;
