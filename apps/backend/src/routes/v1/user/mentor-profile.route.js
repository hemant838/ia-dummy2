const express = require('express');
const router = express.Router({ mergeParams: true });
const mentorProfileController = require('../../../controllers/mentor-profile.controller');

router
  .route('/')
  .get(mentorProfileController.getAllMentorProfiles)
  .post(mentorProfileController.createMentorProfile);

router
  .route('/:id')
  .get(mentorProfileController.getMentorProfileById)
  .put(mentorProfileController.updateMentorProfile)
  .delete(mentorProfileController.deleteMentorProfile);

module.exports = router;
