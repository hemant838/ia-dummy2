import express from 'express';
import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from '../controller/item.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// Create a new Item
router.post('/', authenticate, createItem);

// Get all Items with pagination
router.get('/', authenticate, getAllItems);

// Get Item by ID
router.get('/:id', authenticate, getItemById);

// Update Item
router.put('/:id', authenticate, updateItem);

// Delete Item
router.delete('/:id', authenticate, deleteItem);

export default router; 