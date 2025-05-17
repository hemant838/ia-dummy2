import express from 'express';
import {
    createWorkOrder,
    getAllWorkOrders,
    getWorkOrderById,
    updateWorkOrder,
    deleteWorkOrder
} from '../controller/workOrder.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new Work Order
router.post('/', authenticate, createWorkOrder);

// Get all Work Orders with pagination
router.get('/', authenticate, getAllWorkOrders);

// Get Work Order by ID
router.get('/:id', authenticate, getWorkOrderById);

// Update Work Order
router.put('/:id', authenticate, updateWorkOrder);

// Delete Work Order
router.delete('/:id', authenticate, deleteWorkOrder);

export default router; 