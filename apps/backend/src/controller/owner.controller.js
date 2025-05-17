import { PrismaClient } from '@workspace/database';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create Owner
export const createOwner = handleError.asyncHandler(async (req, res) => {
    const {
        name,
        address,
        email,
        contactNumber
    } = req.body;

    const owner = await prisma.owner.create({
        data: {
            name,
            address,
            email,
            contactNumber
        }
    });

    handleError.success(req, res, owner, 'Owner created successfully', HTTP_STATUS.CREATED);
});

// Get all Owners with pagination
export const getAllOwners = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [owners, total] = await Promise.all([
        prisma.owner.findMany({
            skip,
            take,
            include: {
                insurancePolicies: true,
                vehicle: true
            }
        }),
        prisma.owner.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { owners, metadata }, 'Owners retrieved successfully');
});

// Get Owner by ID
export const getOwnerById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const owner = await prisma.owner.findUnique({
        where: { id },
        include: {
            insurancePolicies: true,
            vehicle: true
        }
    });

    if (!owner) {
        throw new handleError.NotFoundError('Owner not found');
    }

    handleError.success(req, res, owner, 'Owner retrieved successfully');
});

// Update Owner
export const updateOwner = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        address,
        email,
        contactNumber
    } = req.body;

    const owner = await prisma.owner.update({
        where: { id },
        data: {
            name,
            address,
            email,
            contactNumber
        }
    });

    handleError.success(req, res, owner, 'Owner updated successfully');
});

// Delete Owner
export const deleteOwner = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.owner.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Owner deleted successfully');
}); 