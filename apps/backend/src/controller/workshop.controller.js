import { PrismaClient } from '@prisma/client';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create Workshop
export const createWorkshop = handleError.asyncHandler(async (req, res) => {
    const {
        name,
        address,
        contact,
        contactName
    } = req.body;

    const workshop = await prisma.workshop.create({
        data: {
            name,
            address,
            contact,
            contactName
        }
    });

    handleError.success(req, res, workshop, 'Workshop created successfully', HTTP_STATUS.CREATED);
});

// Get all Workshops with pagination
export const getAllWorkshops = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [workshops, total] = await Promise.all([
        prisma.workshop.findMany({
            skip,
            take,
            include: {
                claims: true,
                workOrders: true
            }
        }),
        prisma.workshop.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { workshops, metadata }, 'Workshops retrieved successfully');
});

// Get Workshop by ID
export const getWorkshopById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const workshop = await prisma.workshop.findUnique({
        where: { id },
        include: {
            claims: true,
            workOrders: true
        }
    });

    if (!workshop) {
        throw new handleError.NotFoundError('Workshop not found');
    }

    handleError.success(req, res, workshop, 'Workshop retrieved successfully');
});

// Update Workshop
export const updateWorkshop = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        address,
        contact,
        contactName
    } = req.body;

    const workshop = await prisma.workshop.update({
        where: { id },
        data: {
            name,
            address,
            contact,
            contactName
        }
    });

    handleError.success(req, res, workshop, 'Workshop updated successfully');
});

// Delete Workshop
export const deleteWorkshop = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.workshop.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Workshop deleted successfully');
}); 