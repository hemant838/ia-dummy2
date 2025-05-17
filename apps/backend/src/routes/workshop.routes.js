import express from 'express';
import {
    createWorkshop,
    getAllWorkshops,
    getWorkshopById,
    updateWorkshop,
    deleteWorkshop
} from '../controller/workshop.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// Create a new Workshop
router.post('/', authenticate, createWorkshop);

// Get all Workshops with pagination
router.get('/', authenticate, getAllWorkshops);

// Get Workshop by ID
router.get('/:id', authenticate, getWorkshopById);

// Update Workshop
router.put('/:id', authenticate, updateWorkshop);

// Delete Workshop
router.delete('/:id', authenticate, deleteWorkshop);

export default router; 