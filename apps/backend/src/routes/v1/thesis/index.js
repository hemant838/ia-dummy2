const express = require('express');
const router = express.Router({ mergeParams: true });
const { thesisController } = require('../../../controllers');

// CRUD Routes
router.get('/', thesisController.getAllTheses);
router.get('/:id', thesisController.getThesisById);
router.post('/', thesisController.createThesis);
router.put('/:id', thesisController.updateThesis);
router.delete('/:id', thesisController.deleteThesis);

module.exports = router;
