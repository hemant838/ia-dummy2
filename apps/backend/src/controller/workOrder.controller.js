import { PrismaClient } from '@workspace/database';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create WorkOrder
export const createWorkOrder = handleError.asyncHandler(async (req, res) => {
    const {
        billId,
        workshopId,
        claimId,
        status
    } = req.body;

    const workOrder = await prisma.workOrder.create({
        data: {
            billId,
            workshopId,
            claimId,
            status
        }
    });

    handleError.success(req, res, workOrder, 'Work Order created successfully', HTTP_STATUS.CREATED);
});

// Get all WorkOrders with pagination
export const getAllWorkOrders = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [workOrders, total] = await Promise.all([
        prisma.workOrder.findMany({
            skip,
            take,
            include: {
                bill: true,
                claim: true,
                workshop: true,
                items: true
            }
        }),
        prisma.workOrder.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { workOrders, metadata }, 'Work Orders retrieved successfully');
});

// Get WorkOrder by ID
export const getWorkOrderById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const workOrder = await prisma.workOrder.findUnique({
        where: { id },
        include: {
            bill: true,
            claim: true,
            workshop: true,
            items: true
        }
    });

    if (!workOrder) {
        throw new handleError.NotFoundError('Work Order not found');
    }

    handleError.success(req, res, workOrder, 'Work Order retrieved successfully');
});

// Update WorkOrder
export const updateWorkOrder = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        billId,
        workshopId,
        status
    } = req.body;

    const workOrder = await prisma.workOrder.update({
        where: { id },
        data: {
            billId,
            workshopId,
            status
        }
    });

    handleError.success(req, res, workOrder, 'Work Order updated successfully');
});

// Delete WorkOrder
export const deleteWorkOrder = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.workOrder.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Work Order deleted successfully');
}); 