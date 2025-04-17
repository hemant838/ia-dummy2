const express = require('express');
const router = express.Router({ mergeParams: true });
const { startupController } = require('../../../controllers');

// CRUD Routes
router.get('/', startupController.getAllStartups);
router.get('/:id', startupController.getStartupById);
router.post('/', startupController.createStartup);
router.put('/:id', startupController.updateStartup);
router.delete('/:id', startupController.deleteStartup);

module.exports = router;
