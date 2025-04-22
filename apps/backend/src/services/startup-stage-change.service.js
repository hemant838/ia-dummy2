const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip, take, startupId, fromStage, toStage, search }) => {
  try {
    const where = {};

    if (startupId) {
      where.startupId = startupId;
    }

    if (fromStage) {
      where.fromStage = fromStage;
    }

    if (toStage) {
      where.toStage = toStage;
    }

    if (search) {
      where.OR = [
        { notes: { contains: search, mode: 'insensitive' } },
        { startup: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [stageChanges, total] = await Promise.all([
      prisma.startupStageChange.findMany({
        where,
        skip,
        take,
        orderBy: { changedAt: 'desc' },
        include: {
          startup: {
            select: {
              id: true,
              name: true,
              stage: true,
            },
          },
          startupApplication: {
            select: {
              id: true,
              evaluationStage: true,
              evaluationStatus: true,
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
      prisma.startupStageChange.count({ where }),
    ]);

    return { data: stageChanges, total };
  } catch (error) {
    throw new Error(`Error fetching startup stage changes: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const stageChange = await prisma.startupStageChange.findUnique({
      where: { id },
      include: {
        startup: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
        startupApplication: {
          select: {
            id: true,
            evaluationStage: true,
            evaluationStatus: true,
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

    if (!stageChange) {
      throw new NotFound(`Startup stage change with ID ${id} not found`);
    }

    return stageChange;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching startup stage change: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['startupId', 'fromStage', 'toStage', 'changedBy'];
    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate relationships exist
    const [startup, user] = await Promise.all([
      prisma.startup.findUnique({ where: { id: data.startupId } }),
      prisma.user.findUnique({ where: { id: data.changedBy } }),
    ]);

    if (!startup) {
      throw new ValidationErrors(
        null,
        `Startup with ID ${data.startupId} not found`,
      );
    }

    if (!user) {
      throw new ValidationErrors(
        null,
        `User with ID ${data.changedBy} not found`,
      );
    }

    // If startupApplicationId is provided, validate it exists
    if (data.startupApplicationId) {
      const application = await prisma.startupApplication.findUnique({
        where: { id: data.startupApplicationId },
      });
      if (!application) {
        throw new ValidationErrors(
          null,
          `Startup application with ID ${data.startupApplicationId} not found`,
        );
      }
    }

    // Validate stage values
    const validStages = ['IDEATION', 'MVP', 'EARLY_TRACTION', 'SCALING'];
    if (!validStages.includes(data.fromStage)) {
      throw new ValidationErrors(
        null,
        `Invalid fromStage. Must be one of: ${validStages.join(', ')}`,
      );
    }
    if (!validStages.includes(data.toStage)) {
      throw new ValidationErrors(
        null,
        `Invalid toStage. Must be one of: ${validStages.join(', ')}`,
      );
    }

    return prisma.startupStageChange.create({
      data: {
        ...data,
        changedAt: new Date(),
      },
      include: {
        startup: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
        startupApplication: {
          select: {
            id: true,
            evaluationStage: true,
            evaluationStatus: true,
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
    throw new Error(`Error creating startup stage change: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Check if stage change exists
    const exists = await prisma.startupStageChange.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup stage change with ID ${id} not found`);
    }

    // Prevent updating certain fields
    delete data.id;
    delete data.startupId;
    delete data.changedBy;
    delete data.changedAt;

    // Validate stage values if provided
    const validStages = ['IDEATION', 'MVP', 'EARLY_TRACTION', 'SCALING'];
    if (data.fromStage && !validStages.includes(data.fromStage)) {
      throw new ValidationErrors(
        null,
        `Invalid fromStage. Must be one of: ${validStages.join(', ')}`,
      );
    }
    if (data.toStage && !validStages.includes(data.toStage)) {
      throw new ValidationErrors(
        null,
        `Invalid toStage. Must be one of: ${validStages.join(', ')}`,
      );
    }

    return prisma.startupStageChange.update({
      where: { id },
      data,
      include: {
        startup: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
        startupApplication: {
          select: {
            id: true,
            evaluationStage: true,
            evaluationStatus: true,
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
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating startup stage change: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if stage change exists
    const exists = await prisma.startupStageChange.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup stage change with ID ${id} not found`);
    }

    await prisma.startupStageChange.delete({
      where: { id },
    });

    return { message: 'Startup stage change deleted successfully' };
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting startup stage change: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
}; 