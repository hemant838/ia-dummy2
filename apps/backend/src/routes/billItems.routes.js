import express from 'express';
import {
    createBillItem,
    getAllBillItems,
    getBillItemById,
    updateBillItem,
    deleteBillItem
} from '../controller/billItems.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new Bill Item
router.post('/', authenticate, createBillItem);

// Get all Bill Items with pagination
router.get('/', authenticate, getAllBillItems);

// Get Bill Item by ID
router.get('/:id', authenticate, getBillItemById);

// Update Bill Item
router.put('/:id', authenticate, updateBillItem);

// Delete Bill Item
router.delete('/:id', authenticate, deleteBillItem);

export default router;