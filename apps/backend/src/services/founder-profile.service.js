const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip, take, userId, startupId, search }) => {
  try {
    const where = {};

    if (userId) {
      where.userId = userId;
    }

    if (startupId) {
      where.startupId = startupId;
    }

    if (search) {
      where.OR = [
        { role: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { startup: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [founderProfiles, total] = await Promise.all([
      prisma.founderProfile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          startup: {
            select: {
              id: true,
              name: true,
              stage: true,
            },
          },
        },
      }),
      prisma.founderProfile.count({ where }),
    ]);

    return { data: founderProfiles, total };
  } catch (error) {
    throw new Error(`Error fetching founder profiles: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const founderProfile = await prisma.founderProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        startup: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
      },
    });

    if (!founderProfile) {
      throw new NotFound(`Founder profile with ID ${id} not found`);
    }

    return founderProfile;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching founder profile: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['userId', 'startupId', 'role'];
    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate relationships exist
    const [user, startup] = await Promise.all([
      prisma.user.findUnique({ where: { id: data.userId } }),
      prisma.startup.findUnique({ where: { id: data.startupId } }),
    ]);

    if (!user) {
      throw new ValidationErrors(null, `User with ID ${data.userId} not found`);
    }

    if (!startup) {
      throw new ValidationErrors(
        null,
        `Startup with ID ${data.startupId} not found`,
      );
    }

    // Check if founder profile already exists for this user
    const existingProfile = await prisma.founderProfile.findUnique({
      where: { userId: data.userId },
    });

    if (existingProfile) {
      throw new ValidationErrors(
        null,
        `Founder profile already exists for user ${data.userId}`,
      );
    }

    // Validate equity percentage if provided
    if (data.equity && (data.equity < 0 || data.equity > 100)) {
      throw new ValidationErrors(
        null,
        'Equity percentage must be between 0 and 100',
      );
    }

    return prisma.founderProfile.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        startup: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating founder profile: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Check if founder profile exists
    const exists = await prisma.founderProfile.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Founder profile with ID ${id} not found`);
    }

    // Prevent updating certain fields
    delete data.id;
    delete data.userId;
    delete data.startupId;
    delete data.createdAt;

    // Validate equity percentage if provided
    if (data.equity && (data.equity < 0 || data.equity > 100)) {
      throw new ValidationErrors(
        null,
        'Equity percentage must be between 0 and 100',
      );
    }

    return prisma.founderProfile.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        startup: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating founder profile: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if founder profile exists
    const exists = await prisma.founderProfile.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Founder profile with ID ${id} not found`);
    }

    await prisma.founderProfile.delete({
      where: { id },
    });

    return { message: 'Founder profile deleted successfully' };
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting founder profile: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
};
