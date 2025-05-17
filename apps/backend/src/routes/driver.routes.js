import express from 'express';
import {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deleteDriver
} from '../controller/driver.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new Driver
router.post('/', authenticate, createDriver);

// Get all Drivers with pagination
router.get('/', authenticate, getAllDrivers);

// Get Driver by ID
router.get('/:id', authenticate, getDriverById);

// Update Driver
router.put('/:id', authenticate, updateDriver);

// Delete Driver
router.delete('/:id', authenticate, deleteDriver);

export default router; 