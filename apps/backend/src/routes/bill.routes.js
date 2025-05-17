import express from 'express';
import {
    createBill,
    getAllBills,
    getBillById,
    updateBill,
    deleteBill
} from '../controller/bill.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new Bill
router.post('/', authenticate, createBill);

// Get all Bills with pagination
router.get('/', authenticate, getAllBills);

// Get Bill by ID
router.get('/:id', authenticate, getBillById);

// Update Bill
router.put('/:id', authenticate, updateBill);

// Delete Bill
router.delete('/:id', authenticate, deleteBill);

export default router; 