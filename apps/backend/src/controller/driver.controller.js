import { PrismaClient } from '@prisma/client';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create Driver
export const createDriver = handleError.asyncHandler(async (req, res) => {
    const {
        vehicleParked,
        relationWithOwner,
        name,
        address,
        contactNumber,
        licenseNumber,
        licenseType,
        driverDOB,
        issueDate,
        expiryDate,
        MDLAuthority,
        DLEndorsement,
        drivingAllowed
    } = req.body;

    const driver = await prisma.driver.create({
        data: {
            vehicleParked,
            relationWithOwner,
            name,
            address,
            contactNumber,
            licenseNumber,
            licenseType,
            driverDOB,
            issueDate,
            expiryDate,
            MDLAuthority,
            DLEndorsement,
            drivingAllowed
        }
    });

    handleError.success(req, res, driver, 'Driver created successfully', HTTP_STATUS.CREATED);
});

// Get all Drivers with pagination
export const getAllDrivers = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [drivers, total] = await Promise.all([
        prisma.driver.findMany({
            skip,
            take,
            include: {
                incidents: true
            }
        }),
        prisma.driver.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { drivers, metadata }, 'Drivers retrieved successfully');
});

// Get Driver by ID
export const getDriverById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const driver = await prisma.driver.findUnique({
        where: { id },
        include: {
            incidents: true
        }
    });

    if (!driver) {
        throw new handleError.NotFoundError('Driver not found');
    }

    handleError.success(req, res, driver, 'Driver retrieved successfully');
});

// Update Driver
export const updateDriver = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        vehicleParked,
        relationWithOwner,
        name,
        address,
        contactNumber,
        licenseNumber,
        licenseType,
        driverDOB,
        issueDate,
        expiryDate,
        MDLAuthority,
        DLEndorsement,
        drivingAllowed
    } = req.body;

    const driver = await prisma.driver.update({
        where: { id },
        data: {
            vehicleParked,
            relationWithOwner,
            name,
            address,
            contactNumber,
            licenseNumber,
            licenseType,
            driverDOB,
            issueDate,
            expiryDate,
            MDLAuthority,
            DLEndorsement,
            drivingAllowed
        }
    });

    handleError.success(req, res, driver, 'Driver updated successfully');
});

// Delete Driver
export const deleteDriver = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.driver.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Driver deleted successfully');
}); 