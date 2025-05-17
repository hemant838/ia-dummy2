import express from 'express';
import {
    createOwner,
    getAllOwners,
    getOwnerById,
    updateOwner,
    deleteOwner
} from '../controller/owner.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new Owner
router.post('/', authenticate, createOwner);

// Get all Owners with pagination
router.get('/', authenticate, getAllOwners);

// Get Owner by ID
router.get('/:id', authenticate, getOwnerById);

// Update Owner
router.put('/:id', authenticate, updateOwner);

// Delete Owner
router.delete('/:id', authenticate, deleteOwner);

export default router; 