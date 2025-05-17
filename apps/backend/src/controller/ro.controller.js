import { PrismaClient } from '@prisma/client';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create RO
export const createRO = handleError.asyncHandler(async (req, res) => {
    const {
        icId,
        name,
        ro_code,
        address,
        GST,
        contactPersonName,
        contactNumber,
        contactEmail
    } = req.body;

    const ro = await prisma.rO.create({
        data: {
            icId,
            name,
            ro_code,
            address,
            GST,
            contactPersonName,
            contactNumber,
            contactEmail
        }
    });

    handleError.success(req, res, ro, 'RO created successfully', HTTP_STATUS.CREATED);
});

// Get all ROs with pagination
export const getAllROs = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [ros, total] = await Promise.all([
        prisma.rO.findMany({
            skip,
            take,
            where: {
                status: 'ACTIVE'
            },
            include: {
                ic: true,
                hubs: true
            }
        }),
        prisma.rO.count({
            where: {
                status: 'ACTIVE'
            }
        })
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { ros, metadata }, 'ROs retrieved successfully');
});

// Get RO by ID
export const getROById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ro = await prisma.rO.findUnique({
        where: { id },
        include: {
            ic: true,
            hubs: true
        }
    });

    if (!ro) {
        throw new handleError.NotFoundError('RO not found');
    }

    handleError.success(req, res, ro, 'RO retrieved successfully');
});

// Update RO
export const updateRO = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        ro_code,
        address,
        GST,
        contactPersonName,
        contactNumber,
        contactEmail,
        status
    } = req.body;

    const ro = await prisma.rO.update({
        where: { id },
        data: {
            name,
            ro_code,
            address,
            GST,
            contactPersonName,
            contactNumber,
            contactEmail,
            status
        }
    });

    handleError.success(req, res, ro, 'RO updated successfully');
});

// Delete RO (Soft delete by updating status)
export const deleteRO = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ro = await prisma.rO.update({
        where: { id },
        data: {
            status: 'INACTIVE'
        }
    });

    handleError.success(req, res, ro, 'RO deleted successfully');
}); 