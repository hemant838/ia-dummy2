import express from 'express';
import {
    createClaimStatus,
    getAllClaimStatuses,
    getClaimStatusById,
    updateClaimStatus,
    deleteClaimStatus
} from '../controller/claimStatus.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new Claim Status
router.post('/', authenticate, createClaimStatus);

// Get all Claim Statuses with pagination
router.get('/', authenticate, getAllClaimStatuses);

// Get Claim Status by ID
router.get('/:id', authenticate, getClaimStatusById);

// Update Claim Status
router.put('/:id', authenticate, updateClaimStatus);

// Delete Claim Status
router.delete('/:id', authenticate, deleteClaimStatus);

export default router; 