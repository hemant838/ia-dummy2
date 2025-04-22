const express = require('express');
const router = express.Router({ mergeParams: true });

const { userController } = require('../../../controllers');
const middlewares = require('../../../middlewares');

const founderProfile = require('./founder-profile.route');
const investorProfile = require('./investor-profile.route');
const mentorProfile = require('./mentor-profile.route');

router.use(middlewares.auth.authenticateAuthJWT);

router.get('/', userController.getProfile);

router.use('/founder-profile', founderProfile);
router.use('/investor-profile', investorProfile);
router.use('/mentor-profile', mentorProfile);

module.exports = router;
