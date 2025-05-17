import { PrismaClient } from '@workspace/database';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Get all claims with pagination
export const getAllClaims = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);

    const [claims, total] = await Promise.all([
        prisma.claim.findMany({
            skip,
            take,
            include: {
                users: true,
                hub: true,
                workshop: true,
                claimStatus: true,
                insurancePolicy: true,
                images: true,
                lossDetails: true,
                incident: true,
                workOrder: true
            }
        }),
        prisma.claim.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { claims, metadata }, 'Claims retrieved successfully');
});

// Get claim by ID
export const getClaimById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const claim = await prisma.claim.findUnique({
        where: { id },
        include: {
            users: true,
            hub: true,
            workshop: true,
            claimStatus: true,
            insurancePolicy: true,
            images: true,
            lossDetails: true,
            incident: true,
            workOrder: true
        }
    });

    if (!claim) {
        throw new handleError.NotFoundError('Claim not found');
    }

    handleError.success(req, res, claim, 'Claim retrieved successfully');
});

// Create new claim
export const createClaim = handleError.asyncHandler(async (req, res) => {
   const {
      claimNumber,
      internalClaimNumber,
      hubId,
      incidentId,
      workshopId,
      organizationId,
      insurancePolicyId,
    } = req.body;
    
    const claim = await prisma.claim.create({
        data: {
            claimNumber,
          internalClaimNumber,
          hubId,
          incidentId,
          workshopId,
          organizationId,
          insurancePolicyId,
            claimStatus: {
                create: {
                    status: 'CLAIM_INITIATED',
                    updatedById: req.user.id
                }
            }
        },
        include: {
            users: true,
            hub: true,
            workshop: true,
            claimStatus: true,
            insurancePolicy: true,
            images: true,
            lossDetails: true,
            incident: true,
            workOrder: true
        }
    });

    handleError.success(req, res, claim, 'Claim created successfully', HTTP_STATUS.CREATED);
});

// Update claim
export const updateClaim = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      claimNumber,
      internalClaimNumber,
      hubId,
      incidentId,
      workshopId,
      organizationId,
      insurancePolicyId,
    } = req.body;

    const claim = await prisma.claim.update({
        where: { id },
        data: {
          claimNumber,
          internalClaimNumber,
          hubId,
          incidentId,
          workshopId,
          organizationId,
          insurancePolicyId,
        },
        include: {
            users: true,
            hub: true,
            workshop: true,
            claimStatus: true,
            insurancePolicy: true,
            images: true,
            lossDetails: true,
            incident: true,
            workOrder: true
        }
    });

    handleError.success(req, res, claim, 'Claim updated successfully');
});

// Delete claim
export const deleteClaim = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await prisma.claim.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Claim deleted successfully');
});

// Update claim status
export const updateClaimStatus = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const claim = await prisma.claim.update({
        where: { id },
        data: {
            claimStatus: {
                update: {
                    status,
                    updatedById: req.user.id
                }
            }
        },
        include: {
            claimStatus: true
        }
    });

    handleError.success(req, res, claim, 'Claim status updated successfully');
});

// Add images to claim
export const addClaimImages = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { images } = req.body;

    const claim = await prisma.claim.update({
        where: { id },
        data: {
            images: {
                create: images.map(image => ({
                    url: image.url,
                    fileName: image.fileName,
                    mimeType: image.mimeType,
                    size: image.size
                }))
            }
        },
        include: {
            images: true
        }
    });

    handleError.success(req, res, claim, 'Claim images added successfully');
});

// Get claim images
export const getClaimImages = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const claim = await prisma.claim.findUnique({
        where: { id },
        include: {
            images: true
        }
    });

    if (!claim) {
        throw new handleError.NotFoundError('Claim not found');
    }

    handleError.success(req, res, claim.images, 'Claim images retrieved successfully');
});

// Assign users to claim
export const assignUsersToClaim = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userIds } = req.body;

    const claim = await prisma.claim.update({
        where: { id },
        data: {
            users: {
                connect: userIds.map(userId => ({ id: userId }))
            }
        },
        include: {
            users: true
        }
    });

    handleError.success(req, res, claim, 'Users assigned to claim successfully');
});

// Remove users from claim
export const removeUsersFromClaim = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userIds } = req.body;

    const claim = await prisma.claim.update({
        where: { id },
        data: {
            users: {
                disconnect: userIds.map(userId => ({ id: userId }))
            }
        },
        include: {
            users: true
        }
    });

    handleError.success(req, res, claim, 'Users removed from claim successfully');
});