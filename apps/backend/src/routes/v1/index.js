const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../../controllers');
const startupRoutes = require('./startup');
const contactRoutes = require('./contact');
const thesisRoutes = require('./thesis');
const authRoutes = require('./auth');

router.get('/', controller.commonController.index);
router.get('/health', controller.commonController.health);

router.use('/startup', startupRoutes);
router.use('/contact', contactRoutes);
router.use('/thesis', thesisRoutes);
router.use('/', authRoutes);

module.exports = router;
