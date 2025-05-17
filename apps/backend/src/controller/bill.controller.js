import { PrismaClient } from '@prisma/client';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create Bill
export const createBill = handleError.asyncHandler(async (req, res) => {
    // Input validation
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new handleError.BadRequestError('Bill data is required');
    }

    const bill = await prisma.bill.create({
        data: {
            ...req.body,
        },
        include: {
            billCareDetails: true,
            billToICs: {
                include: {
                    organization: true
                }
            },
            workOrders: true
        }
    });

    handleError.success(req, res, bill, 'Bill created successfully', HTTP_STATUS.CREATED);
});

// Get all Bills with pagination
export const getAllBills = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [bills, total] = await Promise.all([
        prisma.bill.findMany({
            skip,
            take,
            include: {
                billCareDetails: true,
                billToICs: {
                    include: {
                        organization: true
                    }
                },
                workOrders: true
            }
        }),
        prisma.bill.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { bills, metadata }, 'Bills retrieved successfully');
});

// Get Bill by ID
export const getBillById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const bill = await prisma.bill.findUnique({
        where: { id },
        include: {
            billCareDetails: true,
            billToICs: {
                include: {
                    organization: true
                }
            },
            workOrders: true
        }
    });

    if (!bill) {
        throw new handleError.NotFoundError('Bill not found');
    }

    handleError.success(req, res, bill, 'Bill retrieved successfully');
});

// Update Bill
export const updateBill = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Input validation
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new handleError.BadRequestError('Bill update data is required');
    }

    // Check if bill exists
    const existingBill = await prisma.bill.findUnique({
        where: { id }
    });

    if (!existingBill) {
        throw new handleError.NotFoundError('Bill not found');
    }

    const bill = await prisma.bill.update({
        where: { id },
        data: {
            ...req.body
        },
        include: {
            billCareDetails: true,
            billToICs: {
                include: {
                    organization: true
                }
            },
            workOrders: true
        }
    });

    handleError.success(req, res, bill, 'Bill updated successfully');
});

// Delete Bill
export const deleteBill = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.bill.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Bill deleted successfully');
}); 