import { PrismaClient } from '@workspace/database';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create Hub
export const createHub = handleError.asyncHandler(async (req, res) => {
    const {
        roId,
        name,
        hub_code,
        address,
        GST,
        contactPersonName,
        contactNumber,
        contactEmail
    } = req.body;

    const hub = await prisma.hub.create({
        data: {
            roId,
            name,
            hub_code,
            address,
            GST,
            contactPersonName,
            contactNumber,
            contactEmail
        }
    });

    handleError.success(req, res, hub, 'Hub created successfully', HTTP_STATUS.CREATED);
});

// Get all Hubs with pagination
export const getAllHubs = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [hubs, total] = await Promise.all([
        prisma.hub.findMany({
            skip,
            take,
            where: {
                status: 'ACTIVE'
            },
            include: {
                ro: true,
                claims: true
            }
        }),
        prisma.hub.count({
            where: {
                status: 'ACTIVE'
            }
        })
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { hubs, metadata }, 'Hubs retrieved successfully');
});

// Get Hub by ID
export const getHubById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const hub = await prisma.hub.findUnique({
        where: { id },
        include: {
            ro: true,
            claims: true
        }
    });

    if (!hub) {
        throw new handleError.NotFoundError('Hub not found');
    }

    handleError.success(req, res, hub, 'Hub retrieved successfully');
});

// Update Hub
export const updateHub = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        hub_code,
        address,
        GST,
        contactPersonName,
        contactNumber,
        contactEmail,
        status
    } = req.body;

    const hub = await prisma.hub.update({
        where: { id },
        data: {
            name,
            hub_code,
            address,
            GST,
            contactPersonName,
            contactNumber,
            contactEmail,
            status
        }
    });

    handleError.success(req, res, hub, 'Hub updated successfully');
});

// Delete Hub (Soft delete by updating status)
export const deleteHub = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const hub = await prisma.hub.update({
        where: { id },
        data: {
            status: 'INACTIVE'
        }
    });

    handleError.success(req, res, hub, 'Hub deleted successfully');
}); 