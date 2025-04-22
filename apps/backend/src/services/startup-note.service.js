const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip = 0, take = 10, startupApplicationId, userId, search }) => {
  try {
    const where = {};

    if (startupApplicationId) where.startupApplicationId = startupApplicationId;
    if (userId) where.userId = userId;
    if (search) {
      where.content = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      prisma.startupNote.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.startupNote.count({ where }),
    ]);

    return { data, total };
  } catch (error) {
    throw new Error(`Error fetching startup notes: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const note = await prisma.startupNote.findUnique({
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!note) {
      throw new NotFound(`Startup note with ID ${id} not found`);
    }

    return note;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching startup note: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['startupApplicationId', 'userId', 'content'];
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) {
      throw new ValidationErrors(null, `User with ID ${data.userId} not found`);
    }

    return prisma.startupNote.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
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
        user: {
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
    throw new Error(`Error creating startup note: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Check if note exists
    const exists = await prisma.startupNote.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup note with ID ${id} not found`);
    }

    // Prevent changing startupApplicationId and userId
    delete data.startupApplicationId;
    delete data.userId;

    return prisma.startupNote.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error updating startup note: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if note exists
    const exists = await prisma.startupNote.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup note with ID ${id} not found`);
    }

    return prisma.startupNote.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting startup note: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
}; 