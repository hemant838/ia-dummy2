import { PrismaClient } from '@workspace/database';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create IC
export const createIC = handleError.asyncHandler(async (req, res) => {
    const {
        organizationId,
        name,
        ic_code,
        address,
        GST,
        contactPersonName,
        contactNumber,
        contactEmail
    } = req.body;

    const ic = await prisma.iC.create({
        data: {
            organizationId,
            name,
            ic_code,
            address,
            GST,
            contactPersonName,
            contactNumber,
            contactEmail
        }
    });

    handleError.success(req, res, ic, 'IC created successfully', HTTP_STATUS.CREATED);
});

// Get all ICs with pagination
export const getAllICs = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [ics, total] = await Promise.all([
        prisma.iC.findMany({
            skip,
            take,
            where: {
                status: 'ACTIVE'
            },
            include: {
                organization: true,
                ros: true
            }
        }),
        prisma.iC.count({
            where: {
                status: 'ACTIVE'
            }
        })
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { ics, metadata }, 'ICs retrieved successfully');
});

// Get IC by ID
export const getICById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ic = await prisma.iC.findUnique({
        where: { id },
        include: {
            organization: true,
            ros: true
        }
    });

    if (!ic) {
        throw new handleError.NotFoundError('IC not found');
    }

    handleError.success(req, res, ic, 'IC retrieved successfully');
});

// Update IC
export const updateIC = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        ic_code,
        address,
        GST,
        contactPersonName,
        contactNumber,
        contactEmail,
        status
    } = req.body;

    const ic = await prisma.iC.update({
        where: { id },
        data: {
            name,
            ic_code,
            address,
            GST,
            contactPersonName,
            contactNumber,
            contactEmail,
            status
        }
    });

    handleError.success(req, res, ic, 'IC updated successfully');
});

// Delete IC (Soft delete by updating status)
export const deleteIC = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ic = await prisma.iC.update({
        where: { id },
        data: {
            status: 'INACTIVE'
        }
    });

    handleError.success(req, res, ic, 'IC deleted successfully');
}); 