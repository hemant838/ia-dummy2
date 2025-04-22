const express = require('express');
const router = express.Router({ mergeParams: true });
const { startupNoteController } = require('../../../controllers');

router
  .route('/note')
  .get(startupNoteController.getAllStartupNotes)
  .post(startupNoteController.createStartupNote);

router
  .route('/note/:id')
  .get(startupNoteController.getStartupNoteById)
  .put(startupNoteController.updateStartupNote)
  .delete(startupNoteController.deleteStartupNote);

module.exports = router;
