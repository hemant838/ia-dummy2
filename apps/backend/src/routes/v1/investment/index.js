const express = require('express');
const router = express.Router({ mergeParams: true });
const { investmentController } = require('../../../controllers');

// CRUD Routes
router.get('/', investmentController.getAllInvestments);
router.get('/:id', investmentController.getInvestmentById);
router.post('/', investmentController.createInvestment);
router.put('/:id', investmentController.updateInvestment);
router.delete('/:id', investmentController.deleteInvestment);

module.exports = router; 