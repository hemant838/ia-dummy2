import express from 'express';
import {
    createInsurancePolicy,
    getAllInsurancePolicies,
    getInsurancePolicyById,
    updateInsurancePolicy,
    deleteInsurancePolicy
} from '../controller/insurancePolicy.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// Create a new Insurance Policy
router.post('/', authenticate, createInsurancePolicy);

// Get all Insurance Policies with pagination
router.get('/', authenticate, getAllInsurancePolicies);

// Get Insurance Policy by ID
router.get('/:id', authenticate, getInsurancePolicyById);

// Update Insurance Policy
router.put('/:id', authenticate, updateInsurancePolicy);

// Delete Insurance Policy
router.delete('/:id', authenticate, deleteInsurancePolicy);

export default router; 