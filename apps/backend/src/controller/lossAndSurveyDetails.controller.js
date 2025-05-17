import { PrismaClient } from '@workspace/database';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create LossAndSurveyDetails
export const createLossAndSurveyDetails = handleError.asyncHandler(async (req, res) => {
    const {
        accidentDate,
        intimationDate,
        surveyAllotmentDate,
        surveyDate,
        lossDescription,
        lossNature,
        observation,
        thirdPartyLoss,
        policeComplaintNo,
        policeComplaintDetails,
        claimId
    } = req.body;

    const lossDetails = await prisma.lossAndSurveyDetails.create({
        data: {
            accidentDate,
            intimationDate,
            surveyAllotmentDate,
            surveyDate,
            lossDescription,
            lossNature,
            observation,
            thirdPartyLoss,
            policeComplaintNo,
            policeComplaintDetails,
            claimId
        }
    });

    handleError.success(req, res, lossDetails, 'Loss and Survey Details created successfully', HTTP_STATUS.CREATED);
});

// Get all LossAndSurveyDetails with pagination
export const getAllLossAndSurveyDetails = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [lossDetails, total] = await Promise.all([
        prisma.lossAndSurveyDetails.findMany({
            skip,
            take,
            include: {
                claim: true
            }
        }),
        prisma.lossAndSurveyDetails.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { lossDetails, metadata }, 'Loss and Survey Details retrieved successfully');
});

// Get LossAndSurveyDetails by ID
export const getLossAndSurveyDetailsById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const lossDetails = await prisma.lossAndSurveyDetails.findUnique({
        where: { id },
        include: {
            claim: true
        }
    });

    if (!lossDetails) {
        throw new handleError.NotFoundError('Loss and Survey Details not found');
    }

    handleError.success(req, res, lossDetails, 'Loss and Survey Details retrieved successfully');
});

// Update LossAndSurveyDetails
export const updateLossAndSurveyDetails = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        accidentDate,
        intimationDate,
        surveyAllotmentDate,
        surveyDate,
        lossDescription,
        lossNature,
        observation,
        thirdPartyLoss,
        policeComplaintNo,
        policeComplaintDetails
    } = req.body;

    const lossDetails = await prisma.lossAndSurveyDetails.update({
        where: { id },
        data: {
            accidentDate,
            intimationDate,
            surveyAllotmentDate,
            surveyDate,
            lossDescription,
            lossNature,
            observation,
            thirdPartyLoss,
            policeComplaintNo,
            policeComplaintDetails
        }
    });

    handleError.success(req, res, lossDetails, 'Loss and Survey Details updated successfully');
});

// Delete LossAndSurveyDetails
export const deleteLossAndSurveyDetails = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.lossAndSurveyDetails.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Loss and Survey Details deleted successfully');
}); 