const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip = 0, take = 10, startupApplicationId, search }) => {
  try {
    const where = {};

    if (startupApplicationId) where.startupApplicationId = startupApplicationId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.startupCompetitor.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          startupApplication: {
            select: {
              id: true,
              startup: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.startupCompetitor.count({ where }),
    ]);

    return { data, total };
  } catch (error) {
    throw new Error(`Error fetching startup competitors: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const competitor = await prisma.startupCompetitor.findUnique({
      where: { id },
      include: {
        startupApplication: {
          select: {
            id: true,
            startup: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!competitor) {
      throw new NotFound(`Startup competitor with ID ${id} not found`);
    }

    return competitor;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching startup competitor: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['startupApplicationId', 'name'];
    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Check if startup application exists
    const application = await prisma.startupApplication.findUnique({
      where: { id: data.startupApplicationId },
    });
    if (!application) {
      throw new ValidationErrors(
        null,
        `Startup application with ID ${data.startupApplicationId} not found`,
      );
    }

    // Validate string lengths
    if (data.name.length > 255) {
      throw new ValidationErrors(null, 'Name must be at most 255 characters');
    }
    if (data.website && data.website.length > 2048) {
      throw new ValidationErrors(null, 'Website URL must be at most 2048 characters');
    }
    if (data.description && data.description.length > 1000) {
      throw new ValidationErrors(null, 'Description must be at most 1000 characters');
    }

    // Validate website URL format if provided
    if (data.website) {
      try {
        new URL(data.website);
      } catch (error) {
        throw new ValidationErrors(null, 'Invalid website URL format');
      }
    }

    return prisma.startupCompetitor.create({
      data,
      include: {
        startupApplication: {
          select: {
            id: true,
            startup: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating startup competitor: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Check if competitor exists
    const exists = await prisma.startupCompetitor.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup competitor with ID ${id} not found`);
    }

    // Prevent changing startupApplicationId
    delete data.startupApplicationId;

    // Validate string lengths
    if (data.name && data.name.length > 255) {
      throw new ValidationErrors(null, 'Name must be at most 255 characters');
    }
    if (data.website && data.website.length > 2048) {
      throw new ValidationErrors(null, 'Website URL must be at most 2048 characters');
    }
    if (data.description && data.description.length > 1000) {
      throw new ValidationErrors(null, 'Description must be at most 1000 characters');
    }

    // Validate website URL format if provided
    if (data.website) {
      try {
        new URL(data.website);
      } catch (error) {
        throw new ValidationErrors(null, 'Invalid website URL format');
      }
    }

    return prisma.startupCompetitor.update({
      where: { id },
      data,
      include: {
        startupApplication: {
          select: {
            id: true,
            startup: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating startup competitor: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if competitor exists
    const exists = await prisma.startupCompetitor.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup competitor with ID ${id} not found`);
    }

    return prisma.startupCompetitor.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting startup competitor: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
}; 