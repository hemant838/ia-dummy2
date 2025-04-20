const express = require('express');
const router = express.Router({ mergeParams: true });
const { programController } = require('../../../controllers');

router
  .route('/')
  .get(programController.getAllPrograms)
  .post(programController.createProgram);

router
  .route('/:id')
  .get(programController.getProgramById)
  .put(programController.updateProgram)
  .delete(programController.deleteProgram);

module.exports = router;
