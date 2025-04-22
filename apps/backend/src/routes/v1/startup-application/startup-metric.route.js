const express = require('express');
const router = express.Router({ mergeParams: true });
const { startupMetricController } = require('../../../controllers');

router
  .route('/metric')
  .get(startupMetricController.getAllStartupMetrics)
  .post(startupMetricController.createStartupMetric);

router
  .route('/metric/:id')
  .get(startupMetricController.getStartupMetricById)
  .put(startupMetricController.updateStartupMetric)
  .delete(startupMetricController.deleteStartupMetric);

module.exports = router;
