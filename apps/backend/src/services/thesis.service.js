const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip, take, search }) => {
  try {
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [theses, total] = await Promise.all([
      prisma.thesis.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          startups: {
            select: {
              id: true,
              name: true,
              stage: true,
              evaluationStage: true,
              legalName: true,
            },
          },
        },
      }),
      prisma.thesis.count({ where }),
    ]);

    return { data: theses, total };
  } catch (error) {
    throw new Error(`Error fetching theses: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const thesis = await prisma.thesis.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        startups: {
          select: {
            id: true,
            name: true,
            stage: true,
            evaluationStage: true,
            description: true,
            foundedDate: true,
            location: true,
            founders: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!thesis) {
      throw new NotFound(`Thesis with ID ${id} not found`);
    }

    return thesis;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching thesis: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['name', 'ownerId'];

    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate owner exists
    const owner = await prisma.user.findUnique({
      where: { id: data.ownerId },
    });

    if (!owner) {
      throw new ValidationErrors(
        null,
        `Owner with ID ${data.ownerId} not found`,
      );
    }

    return prisma.thesis.create({
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating thesis: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Prevent updating id
    delete data.id;

    // Check if thesis exists
    const exists = await prisma.thesis.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Thesis with ID ${id} not found`);
    }

    // Validate owner if being updated
    if (data.ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: data.ownerId },
      });
      if (!owner) {
        throw new ValidationErrors(
          null,
          `Owner with ID ${data.ownerId} not found`,
        );
      }
    }

    return prisma.thesis.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating thesis: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if thesis exists
    const exists = await prisma.thesis.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Thesis with ID ${id} not found`);
    }

    // Check if thesis has any startups
    const hasStartups = await prisma.startup.count({
      where: { thesisId: id },
    });

    if (hasStartups > 0) {
      throw new ValidationErrors(
        null,
        `Cannot delete thesis with associated startups`,
      );
    }

    return prisma.thesis.delete({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error deleting thesis: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
};
