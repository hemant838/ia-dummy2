const express = require('express');
const router = express.Router({ mergeParams: true });

const { authController } = require('../../../controllers');
const middlewares = require('../../../middlewares');

router.post('/sign-in', authController.login);
router.post('/sign-up', authController.register);
router.post(
  '/logout',
  middlewares.auth.authenticateUser,
  authController.logout,
);
router.get(
  '/user',
  middlewares.auth.authenticateUser,
  authController.getProfile,
);
router.get('/refresh-token', authController.refresh);

module.exports = router;
