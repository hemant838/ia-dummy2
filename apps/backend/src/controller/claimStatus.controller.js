import { PrismaClient } from '@workspace/database';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create ClaimStatus
export const createClaimStatus = handleError.asyncHandler(async (req, res) => {
    const {
        status,
        claimId,
        updatedById
    } = req.body;

    const claimStatus = await prisma.claimStatus.create({
        data: {
            status,
            claimId,
            updatedById
        }
    });

    handleError.success(req, res, claimStatus, 'Claim Status created successfully', HTTP_STATUS.CREATED);
});

// Get all ClaimStatuses with pagination
export const getAllClaimStatuses = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [claimStatuses, total] = await Promise.all([
        prisma.claimStatus.findMany({
            skip,
            take,
            include: {
                claim: true,
                updatedBy: true
            }
        }),
        prisma.claimStatus.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { claimStatuses, metadata }, 'Claim Statuses retrieved successfully');
});

// Get ClaimStatus by ID
export const getClaimStatusById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const claimStatus = await prisma.claimStatus.findUnique({
        where: { id },
        include: {
            claim: true,
            updatedBy: true
        }
    });

    if (!claimStatus) {
        throw new handleError.NotFoundError('Claim Status not found');
    }

    handleError.success(req, res, claimStatus, 'Claim Status retrieved successfully');
});

// Update ClaimStatus
export const updateClaimStatus = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        status,
        updatedById
    } = req.body;

    const claimStatus = await prisma.claimStatus.update({
        where: { id },
        data: {
            status,
            updatedById
        }
    });

    handleError.success(req, res, claimStatus, 'Claim Status updated successfully');
});

// Delete ClaimStatus
export const deleteClaimStatus = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.claimStatus.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Claim Status deleted successfully');
}); 