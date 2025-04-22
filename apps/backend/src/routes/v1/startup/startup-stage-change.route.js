const express = require('express');
const router = express.Router({ mergeParams: true });
const { startupStageChangeController } = require('../../../controllers');

// Get all startup stage changes and create new one
router
  .route('/stage-change')
  .get(startupStageChangeController.getAllStartupStageChanges)
  .post(startupStageChangeController.createStartupStageChange);

// Get, update and delete startup stage change by ID
router
  .route('/stage-change/:id')
  .get(startupStageChangeController.getStartupStageChangeById)
  .put(startupStageChangeController.updateStartupStageChange)
  .delete(startupStageChangeController.deleteStartupStageChange);

module.exports = router;
