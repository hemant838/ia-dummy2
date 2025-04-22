const express = require('express');
const router = express.Router({ mergeParams: true });
const { startupDocumentController } = require('../../../controllers');

router
  .route('/document')
  .get(startupDocumentController.getAllStartupDocuments)
  .post(startupDocumentController.createStartupDocument);

router
  .route('/document/:id')
  .get(startupDocumentController.getStartupDocumentById)
  .put(startupDocumentController.updateStartupDocument)
  .delete(startupDocumentController.deleteStartupDocument);

module.exports = router;
