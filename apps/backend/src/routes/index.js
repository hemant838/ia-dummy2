const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../controllers');
const v1 = require('./v1');

router.get('/', controller.commonController.index);
router.get('/health', controller.commonController.health);

router.use('/v1/api', v1);

module.exports = router;
