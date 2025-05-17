import express from 'express';
import {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
} from '../controller/vehicle.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// Create a new Vehicle
router.post('/', authenticate, createVehicle);

// Get all Vehicles with pagination
router.get('/', authenticate, getAllVehicles);

// Get Vehicle by ID
router.get('/:id', authenticate, getVehicleById);

// Update Vehicle
router.put('/:id', authenticate, updateVehicle);

// Delete Vehicle
router.delete('/:id', authenticate, deleteVehicle);

export default router; 