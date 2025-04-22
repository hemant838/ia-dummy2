const express = require('express');
const router = express.Router({ mergeParams: true });
const { startupController } = require('../../../controllers');

const startupDocumentRoute = require('./startup-document.route');
const startupStageChangeRoute = require('./startup-stage-change.route');

// CRUD Routes
router.get('/', startupController.getAllStartups);
router.get('/:id', startupController.getStartupById);
router.post('/', startupController.createStartup);
router.put('/:id', startupController.updateStartup);
router.delete('/:id', startupController.deleteStartup);

router.use('/:id', startupDocumentRoute);
router.use('/:id', startupStageChangeRoute);

module.exports = router;
