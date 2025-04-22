const express = require('express');
const router = express.Router({ mergeParams: true });
const { startupCompetitorController } = require('../../../controllers');

router
  .route('/competitor')
  .get(startupCompetitorController.getAllStartupCompetitors)
  .post(startupCompetitorController.createStartupCompetitor);

router
  .route('/competitor/:id')
  .get(startupCompetitorController.getStartupCompetitorById)
  .put(startupCompetitorController.updateStartupCompetitor)
  .delete(startupCompetitorController.deleteStartupCompetitor);

module.exports = router;
