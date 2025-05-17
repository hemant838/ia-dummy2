import express from 'express';
import {
    createLossAndSurveyDetails,
    getAllLossAndSurveyDetails,
    getLossAndSurveyDetailsById,
    updateLossAndSurveyDetails,
    deleteLossAndSurveyDetails
} from '../controller/lossAndSurveyDetails.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// Create a new Loss and Survey Details
router.post('/', authenticate, createLossAndSurveyDetails);

// Get all Loss and Survey Details with pagination
router.get('/', authenticate, getAllLossAndSurveyDetails);

// Get Loss and Survey Details by ID
router.get('/:id', authenticate, getLossAndSurveyDetailsById);

// Update Loss and Survey Details
router.put('/:id', authenticate, updateLossAndSurveyDetails);

// Delete Loss and Survey Details
router.delete('/:id', authenticate, deleteLossAndSurveyDetails);

export default router; 