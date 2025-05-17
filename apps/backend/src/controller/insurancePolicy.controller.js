import { PrismaClient } from '@prisma/client';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create InsurancePolicy
export const createInsurancePolicy = handleError.asyncHandler(async (req, res) => {
    const {
        policyNumber,
        policyStartDate,
        policyEndDate,
        Confirmation_64v,
        NCB_Confirmation,
        NCBType,
        midYearTransfer,
        midYearTransferDate,
        insuredDeclaredValue,
        voluntaryExcess,
        type,
        policyCover,
        breakIn,
        claimHistory,
        claimAmount,
        nilDepreciationCover,
        depreciationCover,
        consumablesCover,
        additionalTowing,
        tyreCover,
        returnToInvoice,
        vehicleId,
        ownerId,
        icId
    } = req.body;

    const policy = await prisma.insurancePolicy.create({
        data: {
            policyNumber,
            policyStartDate,
            policyEndDate,
            Confirmation_64v,
            NCB_Confirmation,
            NCBType,
            midYearTransfer,
            midYearTransferDate,
            insuredDeclaredValue,
            voluntaryExcess,
            type,
            policyCover,
            breakIn,
            claimHistory,
            claimAmount,
            nilDepreciationCover,
            depreciationCover,
            consumablesCover,
            additionalTowing,
            tyreCover,
            returnToInvoice,
            vehicleId,
            ownerId,
            icId
        }
    });

    handleError.success(req, res, policy, 'Insurance Policy created successfully', HTTP_STATUS.CREATED);
});

// Get all InsurancePolicies with pagination
export const getAllInsurancePolicies = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [policies, total] = await Promise.all([
        prisma.insurancePolicy.findMany({
            skip,
            take,
            include: {
                ic: true,
                owner: true,
                vehicle: true,
                claims: true
            }
        }),
        prisma.insurancePolicy.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { policies, metadata }, 'Insurance Policies retrieved successfully');
});

// Get InsurancePolicy by ID
export const getInsurancePolicyById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const policy = await prisma.insurancePolicy.findUnique({
        where: { id },
        include: {
            ic: true,
            owner: true,
            vehicle: true,
            claims: true
        }
    });

    if (!policy) {
        throw new handleError.NotFoundError('Insurance Policy not found');
    }

    handleError.success(req, res, policy, 'Insurance Policy retrieved successfully');
});

// Update InsurancePolicy
export const updateInsurancePolicy = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        policyNumber,
        policyStartDate,
        policyEndDate,
        Confirmation_64v,
        NCB_Confirmation,
        NCBType,
        midYearTransfer,
        midYearTransferDate,
        insuredDeclaredValue,
        voluntaryExcess,
        type,
        policyCover,
        breakIn,
        claimHistory,
        claimAmount,
        nilDepreciationCover,
        depreciationCover,
        consumablesCover,
        additionalTowing,
        tyreCover,
        returnToInvoice
    } = req.body;

    const policy = await prisma.insurancePolicy.update({
        where: { id },
        data: {
            policyNumber,
            policyStartDate,
            policyEndDate,
            Confirmation_64v,
            NCB_Confirmation,
            NCBType,
            midYearTransfer,
            midYearTransferDate,
            insuredDeclaredValue,
            voluntaryExcess,
            type,
            policyCover,
            breakIn,
            claimHistory,
            claimAmount,
            nilDepreciationCover,
            depreciationCover,
            consumablesCover,
            additionalTowing,
            tyreCover,
            returnToInvoice
        }
    });

    handleError.success(req, res, policy, 'Insurance Policy updated successfully');
});

// Delete InsurancePolicy
export const deleteInsurancePolicy = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.insurancePolicy.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Insurance Policy deleted successfully');
}); 