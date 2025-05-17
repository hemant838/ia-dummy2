import express from 'express';
import {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncident,
    deleteIncident
} from '../controller/incident.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// Create a new Incident
router.post('/', authenticate, createIncident);

// Get all Incidents with pagination
router.get('/', authenticate, getAllIncidents);

// Get Incident by ID
router.get('/:id', authenticate, getIncidentById);

// Update Incident
router.put('/:id', authenticate, updateIncident);

// Delete Incident
router.delete('/:id', authenticate, deleteIncident);

export default router; 