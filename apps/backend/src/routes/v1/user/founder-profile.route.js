const express = require('express');
const router = express.Router({ mergeParams: true });

const { founderProfileController } = require('../../../controllers');

router
  .route('/')
  .get(founderProfileController.getAllFounderProfiles)
  .post(founderProfileController.createFounderProfile);

router
  .route('/:id')
  .get(founderProfileController.getFounderProfileById)
  .put(founderProfileController.updateFounderProfile)
  .delete(founderProfileController.deleteFounderProfile);

module.exports = router;
