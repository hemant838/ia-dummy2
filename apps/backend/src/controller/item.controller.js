import { PrismaClient } from '@prisma/client';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create Item
export const createItem = handleError.asyncHandler(async (req, res) => {
    const {
        description,
        repairOrReplace,
        labourCharges,
        paintCharges,
        isAllowed,
        workOrderId
    } = req.body;

    const item = await prisma.item.create({
        data: {
            description,
            repairOrReplace,
            labourCharges,
            paintCharges,
            isAllowed,
            workOrderId
        }
    });

    handleError.success(req, res, item, 'Item created successfully', HTTP_STATUS.CREATED);
});

// Get all Items with pagination
export const getAllItems = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [items, total] = await Promise.all([
        prisma.item.findMany({
            skip,
            take,
            include: {
                workOrder: true
            }
        }),
        prisma.item.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { items, metadata }, 'Items retrieved successfully');
});

// Get Item by ID
export const getItemById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
        where: { id },
        include: {
            workOrder: true
        }
    });

    if (!item) {
        throw new handleError.NotFoundError('Item not found');
    }

    handleError.success(req, res, item, 'Item retrieved successfully');
});

// Update Item
export const updateItem = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        description,
        repairOrReplace,
        labourCharges,
        paintCharges,
        isAllowed
    } = req.body;

    const item = await prisma.item.update({
        where: { id },
        data: {
            description,
            repairOrReplace,
            labourCharges,
            paintCharges,
            isAllowed
        }
    });

    handleError.success(req, res, item, 'Item updated successfully');
});

// Delete Item
export const deleteItem = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.item.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Item deleted successfully');
}); 