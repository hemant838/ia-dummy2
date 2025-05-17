import express from 'express';
import {
    createHub,
    getAllHubs,
    getHubById,
    updateHub,
    deleteHub
} from '../controller/hub.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new Hub
router.post('/', authenticate, createHub);

// Get all Hubs with pagination
router.get('/', authenticate, getAllHubs);

// Get Hub by ID
router.get('/:id', authenticate, getHubById);

// Update Hub
router.put('/:id', authenticate, updateHub);

// Delete Hub
router.delete('/:id', authenticate, deleteHub);

export default router; 