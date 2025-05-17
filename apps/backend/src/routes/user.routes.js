import { Router } from 'express';
const router = Router();
import userController from '../controller/user.controller.js';
const { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
    getUserClaims, 
    updateNotificationPreferences,
    getUserNotifications,
    markNotificationAsSeen
} = userController;
import {authenticate} from '../middleware/auth.middleware.js';

// Get all users with pagination
router.get('/', authenticate, getAllUsers);

// Get user by ID
router.get('/:id', authenticate, getUserById);

// Create new user
router.post('/', authenticate, createUser);

// Update user
router.put('/:id', authenticate, updateUser);

// Delete user
router.delete('/:id', authenticate, deleteUser);

// Get user claims
router.get('/:id/claims', authenticate, getUserClaims);

// Update user notification preferences
router.patch('/:id/notification-preferences', authenticate, updateNotificationPreferences);

// Get user notifications
router.get('/:id/notifications', authenticate, getUserNotifications);

// Mark notification as seen
router.patch('/:userId/notifications/:notificationId/seen', authenticate, markNotificationAsSeen);

export default router; 