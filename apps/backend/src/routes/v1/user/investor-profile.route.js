const express = require('express');
const router = express.Router({ mergeParams: true });
const investorProfileController = require('../../../controllers/investor-profile.controller');

router
  .route('/')
  .get(investorProfileController.getAllInvestorProfiles)
  .post(investorProfileController.createInvestorProfile);

router
  .route('/:id')
  .get(investorProfileController.getInvestorProfileById)
  .put(investorProfileController.updateInvestorProfile)
  .delete(investorProfileController.deleteInvestorProfile);

module.exports = router;
