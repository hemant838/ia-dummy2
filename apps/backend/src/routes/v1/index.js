const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../../controllers');
const startupRoutes = require('./startup');

router.get('/', controller.commonController.index);
router.get('/health', controller.commonController.health);

router.use('/startup', startupRoutes);

module.exports = router;
