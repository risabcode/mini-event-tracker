const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const eventsController = require('../controllers/eventsController');

// ---------------------------
// Public routes (no auth) — put these FIRST to avoid matching ':id'
// ---------------------------
router.get('/public', eventsController.getPublicEvents);            // GET /api/events/public
router.get('/public/:publicId', eventsController.getPublicEvent);   // GET /api/events/public/:publicId

// ---------------------------
// Protected CRUD routes
// ---------------------------
router.post('/', authMiddleware, eventsController.createEvent);
router.get('/', authMiddleware, eventsController.listEvents);
router.get('/:id', authMiddleware, eventsController.getEvent);
router.delete('/:id', authMiddleware, eventsController.deleteEvent);

module.exports = router;
