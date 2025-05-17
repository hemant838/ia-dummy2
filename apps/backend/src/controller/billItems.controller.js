import { PrismaClient } from '@prisma/client';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create BillItem
export const createBillItem = handleError.asyncHandler(async (req, res) => {
    const {
        billId,
        details
    } = req.body;

    const billItem = await prisma.billItems.create({
        data: {
            billId,
            details
        }
    });

    handleError.success(req, res, billItem, 'Bill Item created successfully', HTTP_STATUS.CREATED);
});

// Get all BillItems with pagination
export const getAllBillItems = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [billItems, total] = await Promise.all([
        prisma.billItems.findMany({
            skip,
            take,
            include: {
                bill: true
            }
        }),
        prisma.billItems.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { billItems, metadata }, 'Bill Items retrieved successfully');
});

// Get BillItem by ID
export const getBillItemById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const billItem = await prisma.billItems.findUnique({
        where: { id },
        include: {
            bill: true
        }
    });

    if (!billItem) {
        throw new handleError.NotFoundError('Bill Item not found');
    }

    handleError.success(req, res, billItem, 'Bill Item retrieved successfully');
});

// Update BillItem
export const updateBillItem = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        details
    } = req.body;

    const billItem = await prisma.billItems.update({
        where: { id },
        data: {
            details
        }
    });

    handleError.success(req, res, billItem, 'Bill Item updated successfully');
});

// Delete BillItem
export const deleteBillItem = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.billItems.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Bill Item deleted successfully');
});