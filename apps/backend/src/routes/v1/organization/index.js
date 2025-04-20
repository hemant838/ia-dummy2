const express = require('express');
const router = express.Router({ mergeParams: true });
const { organizationController } = require('../../../controllers');

router
  .route('/')
  .get(organizationController.getAllOrganizations)
  .post(organizationController.createOrganization);

router
  .route('/:id')
  .get(organizationController.getOrganizationById)
  .put(organizationController.updateOrganization)
  .delete(organizationController.deleteOrganization);

module.exports = router;
