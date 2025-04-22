const express = require('express');
const router = express.Router({ mergeParams: true });
const { startupApplicationController } = require('../../../controllers');

const startupCompetitorRoute = require('./startup-competitor.route');
const startupMetricRoute = require('./startup-metric.route');
const startupNoteRoute = require('./startup-note.route');

// CRUD Routes
router.get('/', startupApplicationController.getAllStartupApplications);
router.get('/:id', startupApplicationController.getStartupApplicationById);
router.post('/', startupApplicationController.createStartupApplication);
router.put('/:id', startupApplicationController.updateStartupApplication);
router.delete('/:id', startupApplicationController.deleteStartupApplication);

// Stage and Status Management
router.put('/:id/stage', startupApplicationController.updateEvaluationStage);
router.put('/:id/status', startupApplicationController.updateEvaluationStatus);

router.use('/:id', startupCompetitorRoute);
router.use('/:id', startupMetricRoute);
router.use('/:id', startupNoteRoute);

// Related Resources
// router.post('/:id/notes', startupApplicationController.addNote);
// router.post('/:id/metrics', startupApplicationController.addMetric);
// router.post('/:id/competitors', startupApplicationController.addCompetitor);
// router.post('/:id/documents', startupApplicationController.addDocument);

// router.delete('/:id/notes/:noteId', startupApplicationController.removeNote);
// router.delete(
//   '/:id/metrics/:metricId',
//   startupApplicationController.removeMetric,
// );
// router.delete(
//   '/:id/competitors/:competitorId',
//   startupApplicationController.removeCompetitor,
// );
// router.delete(
//   '/:id/documents/:documentId',
//   startupApplicationController.removeDocument,
// );

module.exports = router;
