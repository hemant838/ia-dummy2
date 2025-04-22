const express = require('express');
const router = express.Router({ mergeParams: true });
// const controller = require('../../controllers');

const authRoutes = require('./auth');
const userRoutes = require('./user');
const startupRoutes = require('./startup');
const contactRoutes = require('./contact');
const thesisRoutes = require('./thesis');
const organizationRoutes = require('./organization');
const programRoutes = require('./program');
const mentorshipRoutes = require('./mentorship');
const investmentRoutes = require('./investment');
const eventRoutes = require('./event');
const startupApplicationRoutes = require('./startup-application');

// router.get('/', controller.commonController.index);
// router.get('/health', controller.commonController.health);

router.use('/', authRoutes);
router.use('/user', userRoutes);
router.use('/startup', startupRoutes);
router.use('/contact', contactRoutes);
router.use('/thesis', thesisRoutes);
router.use('/organization', organizationRoutes);
router.use('/program', programRoutes);
router.use('/mentorship', mentorshipRoutes);
router.use('/investment', investmentRoutes);
router.use('/event', eventRoutes);
router.use('/startup-application', startupApplicationRoutes);

module.exports = router;
