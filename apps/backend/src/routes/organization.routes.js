import express from 'express';
import { organizationController } from '../controller/organization.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
// get all organizations

router.get('/', organizationController.getAllOrganizations);

// get organization by id
router.get('/:id', organizationController.getOrganizationById);


//private routes
// create organization
router.post('/', authenticate, organizationController.createOrganization);

// update organization
router.put('/:id', authenticate, organizationController.updateOrganization);

// delete organization
router.delete('/:id', authenticate, organizationController.deleteOrganization);

// Get organization members
router.get('/:id/members', authenticate, organizationController.getOrganizationMembers);

export default router; 