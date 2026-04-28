const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const auth = require('../middleware/auth');

// Protect all note routes
router.use(auth);

// Routes
router.get('/', notesController.getNotes);
router.post('/', notesController.createNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;
