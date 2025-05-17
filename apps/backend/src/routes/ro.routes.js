import express from 'express';
import {
    createRO,
    getAllROs,
    getROById,
    updateRO,
    deleteRO
} from '../controller/ro.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// Create a new RO
router.post('/', authenticate, createRO);

// Get all ROs with pagination
router.get('/', authenticate, getAllROs);

// Get RO by ID
router.get('/:id', authenticate, getROById);

// Update RO
router.put('/:id', authenticate, updateRO);

// Delete RO
router.delete('/:id', authenticate, deleteRO);

export default router; 