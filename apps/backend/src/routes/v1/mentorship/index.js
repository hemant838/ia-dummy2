const express = require('express');
const router = express.Router({ mergeParams: true });
const { mentorshipController } = require('../../../controllers');

// CRUD Routes
router.get('/', mentorshipController.getAllMentorships);
router.get('/:id', mentorshipController.getMentorshipById);
router.post('/', mentorshipController.createMentorship);
router.put('/:id', mentorshipController.updateMentorship);
router.delete('/:id', mentorshipController.deleteMentorship);

module.exports = router;
