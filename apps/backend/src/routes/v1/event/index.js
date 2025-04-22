const express = require('express');
const router = express.Router({ mergeParams: true });
const { eventController } = require('../../../controllers');

// CRUD Routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Attendee management
router.post('/:id/attendees', eventController.addAttendee);
router.delete('/:id/attendees/:userId', eventController.removeAttendee);

module.exports = router; 