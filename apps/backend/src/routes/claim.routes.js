import { Router } from 'express';
const router = Router();
import { getAllClaims, getClaimById, createClaim, updateClaim, deleteClaim, updateClaimStatus, addClaimImages, getClaimImages, assignUsersToClaim, removeUsersFromClaim } from '../controller/claim.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

// Get all claims with pagination
router.get('/', authenticate, getAllClaims);

// Get claim by ID
router.get('/:id', authenticate, getClaimById);

// Create new claim
router.post('/', authenticate, createClaim);

// Update claim
router.put('/:id', authenticate, updateClaim);

// Delete claim
router.delete('/:id', authenticate, deleteClaim);

// Update claim status
router.patch('/:id/status', authenticate, updateClaimStatus);

// Add images to claim
router.post('/:id/images', authenticate, addClaimImages);

// Get claim images
router.get('/:id/images', authenticate, getClaimImages);

// Assign users to claim
router.post('/:id/users', authenticate, assignUsersToClaim);

// Remove users from claim
router.delete('/:id/users', authenticate, removeUsersFromClaim);

export default router; 