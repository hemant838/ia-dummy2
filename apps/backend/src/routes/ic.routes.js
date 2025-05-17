import express from 'express';
import {
    createIC,
    getAllICs,
    getICById,
    updateIC,
    deleteIC
} from '../controller/ic.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new IC
router.post('/', authenticate, createIC);

// Get all ICs with pagination
router.get('/', authenticate, getAllICs);

// Get IC by ID
router.get('/:id', authenticate, getICById);

// Update IC
router.put('/:id', authenticate, updateIC);

// Delete IC
router.delete('/:id', authenticate, deleteIC);

export default router; 