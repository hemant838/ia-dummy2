import { PrismaClient } from '@workspace/database';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create Incident
export const createIncident = handleError.asyncHandler(async (req, res) => {
    const {
        description,
        driverId
    } = req.body;

    const incident = await prisma.incident.create({
        data: {
            description,
            driverId
        }
    });

    handleError.success(req, res, incident, 'Incident created successfully', HTTP_STATUS.CREATED);
});

// Get all Incidents with pagination
export const getAllIncidents = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [incidents, total] = await Promise.all([
        prisma.incident.findMany({
            skip,
            take,
            include: {
                driver: true,
                claims: true
            }
        }),
        prisma.incident.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { incidents, metadata }, 'Incidents retrieved successfully');
});

// Get Incident by ID
export const getIncidentById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const incident = await prisma.incident.findUnique({
        where: { id },
        include: {
            driver: true,
            claims: true
        }
    });

    if (!incident) {
        throw new handleError.NotFoundError('Incident not found');
    }

    handleError.success(req, res, incident, 'Incident retrieved successfully');
});

// Update Incident
export const updateIncident = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        description,
        driverId
    } = req.body;

    const incident = await prisma.incident.update({
        where: { id },
        data: {
            description,
            driverId
        }
    });

    handleError.success(req, res, incident, 'Incident updated successfully');
});

// Delete Incident
export const deleteIncident = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.incident.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Incident deleted successfully');
}); 