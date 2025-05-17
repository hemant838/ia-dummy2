import { PrismaClient } from '@prisma/client';
import { handleError, HTTP_STATUS } from '../helper/errorHandler.js';
import { pagination } from '../helper/pagination.js';

const prisma = new PrismaClient();

// Create Vehicle
export const createVehicle = handleError.asyncHandler(async (req, res) => {
    const {
        name,
        vehicleNumber,
        vehicleRegistrationDate,
        ManufacturedYear,
        make,
        model,
        variant,
        chassisNumber,
        chassisVerified,
        engineNumber,
        engineVerified,
        vehicleType,
        cubicCapacity,
        color,
        bodyType,
        vehicleClassType,
        seatingCapacity,
        hypothecated,
        hypothecatedWith,
        RTOEndorsement,
        OdometerReading,
        fuelUsage,
        taxPaid,
        ownerId
    } = req.body;

    const vehicle = await prisma.vehicle.create({
        data: {
            name,
            vehicleNumber,
            vehicleRegistrationDate,
            ManufacturedYear,
            make,
            model,
            variant,
            chassisNumber,
            chassisVerified,
            engineNumber,
            engineVerified,
            vehicleType,
            cubicCapacity,
            color,
            bodyType,
            vehicleClassType,
            seatingCapacity,
            hypothecated,
            hypothecatedWith,
            RTOEndorsement,
            OdometerReading,
            fuelUsage,
            taxPaid,
            ownerId
        }
    });

    handleError.success(req, res, vehicle, 'Vehicle created successfully', HTTP_STATUS.CREATED);
});

// Get all Vehicles with pagination
export const getAllVehicles = handleError.asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = pagination.getPagination(req.query);
    
    const [vehicles, total] = await Promise.all([
        prisma.vehicle.findMany({
            skip,
            take,
            include: {
                ownerDetails: true,
                insurancePolicies: true
            }
        }),
        prisma.vehicle.count()
    ]);

    const metadata = pagination.buildPaginationMetadata(page, limit, total);
    
    handleError.success(req, res, { vehicles, metadata }, 'Vehicles retrieved successfully');
});

// Get Vehicle by ID
export const getVehicleById = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
            ownerDetails: true,
            insurancePolicies: true
        }
    });

    if (!vehicle) {
        throw new handleError.NotFoundError('Vehicle not found');
    }

    handleError.success(req, res, vehicle, 'Vehicle retrieved successfully');
});

// Update Vehicle
export const updateVehicle = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        vehicleNumber,
        vehicleRegistrationDate,
        ManufacturedYear,
        make,
        model,
        variant,
        chassisNumber,
        chassisVerified,
        engineNumber,
        engineVerified,
        vehicleType,
        cubicCapacity,
        color,
        bodyType,
        vehicleClassType,
        seatingCapacity,
        hypothecated,
        hypothecatedWith,
        RTOEndorsement,
        OdometerReading,
        fuelUsage,
        taxPaid
    } = req.body;

    const vehicle = await prisma.vehicle.update({
        where: { id },
        data: {
            name,
            vehicleNumber,
            vehicleRegistrationDate,
            ManufacturedYear,
            make,
            model,
            variant,
            chassisNumber,
            chassisVerified,
            engineNumber,
            engineVerified,
            vehicleType,
            cubicCapacity,
            color,
            bodyType,
            vehicleClassType,
            seatingCapacity,
            hypothecated,
            hypothecatedWith,
            RTOEndorsement,
            OdometerReading,
            fuelUsage,
            taxPaid
        }
    });

    handleError.success(req, res, vehicle, 'Vehicle updated successfully');
});

// Delete Vehicle
export const deleteVehicle = handleError.asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.vehicle.delete({
        where: { id }
    });

    handleError.success(req, res, null, 'Vehicle deleted successfully');
}); 