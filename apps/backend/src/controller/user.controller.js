import { PrismaClient } from '@workspace/database';
import { pagination } from '../helper/pagination.js';
import { handleError } from '../helper/errorHandler.js';

const { getPagination } = pagination;
const prisma = new PrismaClient()

const userController = {
    // Get all users with pagination
    getAllUsers: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { skip, take } = getPagination(page, limit);

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    skip,
                    take,
                    include: {
                        organizations: true,
                        memberships: true,
                        accounts: true,
                        sessions: true,
                        claims: true,
                        notifications: true
                    }
                }),
                prisma.user.count()
            ]);

            res.json({
                data: users,
                meta: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id },
                include: {
                    organizations: true,
                    memberships: true,
                    accounts: true,
                    sessions: true,
                    claims: true,
                    notifications: true
                }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            handleError(res, error);
        }
    },

    // Create new user
    createUser: async (req, res) => {
        try {
            const {
                name,
                email,
                password,
                phone,
                locale,
                completedOnboarding,
                enabledContactsNotifications,
                enabledInboxNotifications,
                enabledWeeklySummary,
                enabledNewsletter,
                enabledProductUpdates,
                organizationId,
                status,
                role,
              } = req.body;

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                    phone,
                    locale,
                    completedOnboarding,
                    enabledContactsNotifications,
                    enabledInboxNotifications,
                    enabledWeeklySummary,
                    enabledNewsletter,
                    enabledProductUpdates,
                    organizationId,
                    status,
                    role,
                  },
                include: {
                    organizations: true,
                    memberships: true
                }
            });

            res.status(201).json(user);
        } catch (error) {
            handleError(res, error);
        }
    },

    // Update user
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                name,
                email,
                password,
                phone,
                locale,
                completedOnboarding,
                enabledContactsNotifications,
                enabledInboxNotifications,
                enabledWeeklySummary,
                enabledNewsletter,
                enabledProductUpdates,
                organizationId,
                status,
                role,
              } = req.body;

            

            const user = await prisma.user.update({
                where: { id },
                data: {
                    name,
                    email,
                    password,
                    phone,
                    locale,
                    completedOnboarding,
                    enabledContactsNotifications,
                    enabledInboxNotifications,
                    enabledWeeklySummary,
                    enabledNewsletter,
                    enabledProductUpdates,
                    organizationId,
                    status,
                    role,
                  },
                include: {
                    organizations: true,
                    memberships: true,
                    accounts: true
                }
            });

            res.json(user);
        } catch (error) {
            handleError(res, error);
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.user.delete({
                where: { id }
            });

            res.status(204).send();
        } catch (error) {
            handleError(res, error);
        }
    },

    // Get user claims
    getUserClaims: async (req, res) => {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const { skip, take } = getPagination(page, limit);

            const [claims, total] = await Promise.all([
                prisma.claim.findMany({
                    where: {
                        users: {
                            some: {
                                id
                            }
                        }
                    },
                    include: {
                        hub: true,
                        workshop: true,
                        claimStatus: true,
                        insurancePolicy: true,
                        organization: true
                    },
                    skip,
                    take
                }),
                prisma.claim.count({
                    where: {
                        users: {
                            some: {
                                id
                            }
                        }
                    }
                })
            ]);

            res.json({
                data: claims,
                meta: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    // Update user notification preferences
    updateNotificationPreferences: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                enabledContactsNotifications, 
                enabledInboxNotifications, 
                enabledWeeklySummary, 
                enabledNewsletter, 
                enabledProductUpdates 
            } = req.body;

            const user = await prisma.user.update({
                where: { id },
                data: {
                    enabledContactsNotifications: enabledContactsNotifications !== undefined ? enabledContactsNotifications : undefined,
                    enabledInboxNotifications: enabledInboxNotifications !== undefined ? enabledInboxNotifications : undefined,
                    enabledWeeklySummary: enabledWeeklySummary !== undefined ? enabledWeeklySummary : undefined,
                    enabledNewsletter: enabledNewsletter !== undefined ? enabledNewsletter : undefined,
                    enabledProductUpdates: enabledProductUpdates !== undefined ? enabledProductUpdates : undefined
                }
            });

            res.json(user);
        } catch (error) {
            handleError(res, error);
        }
    },

    // Get user notifications
    getUserNotifications: async (req, res) => {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const { skip, take } = getPagination(page, limit);

            const [notifications, total] = await Promise.all([
                prisma.notification.findMany({
                    where: { userId: id },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take
                }),
                prisma.notification.count({
                    where: { userId: id }
                })
            ]);

            res.json({
                data: notifications,
                meta: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    // Mark notification as seen
    markNotificationAsSeen: async (req, res) => {
        try {
            const { userId, notificationId } = req.params;

            const notification = await prisma.notification.update({
                where: { 
                    id: notificationId,
                    userId: userId
                },
                data: { 
                    seenAt: new Date(),
                    dismissed: true
                }
            });

            res.json(notification);
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default userController; 