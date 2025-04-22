const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip, take, userId, search }) => {
  try {
    const where = {};

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { investmentPhilosophy: { contains: search, mode: 'insensitive' } },
        { typicalCheckSize: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [investorProfiles, total] = await Promise.all([
      prisma.investorProfile.findMany({
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
              linkedInProfile: true,
              bio: true,
              expertise: true
            },
          },
        },
      }),
      prisma.investorProfile.count({ where }),
    ]);

    return { data: investorProfiles, total };
  } catch (error) {
    throw new Error(`Error fetching investor profiles: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const investorProfile = await prisma.investorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            linkedInProfile: true,
            bio: true,
            expertise: true
          },
        },
      },
    });

    if (!investorProfile) {
      throw new NotFound(`Investor profile with ID ${id} not found`);
    }

    return investorProfile;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching investor profile: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['userId'];
    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new ValidationErrors(null, `User with ID ${data.userId} not found`);
    }

    // Check if investor profile already exists for this user
    const existingProfile = await prisma.investorProfile.findUnique({
      where: { userId: data.userId },
    });

    if (existingProfile) {
      throw new ValidationErrors(
        null,
        `Investor profile already exists for user ${data.userId}`,
      );
    }

    // Validate portfolio size if provided
    if (data.portfolioSize && data.portfolioSize < 0) {
      throw new ValidationErrors(
        null,
        'Portfolio size must be a positive number',
      );
    }

    return prisma.investorProfile.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            linkedInProfile: true,
            bio: true,
            expertise: true
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating investor profile: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Check if investor profile exists
    const exists = await prisma.investorProfile.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Investor profile with ID ${id} not found`);
    }

    // Prevent updating certain fields
    delete data.id;
    delete data.userId;
    delete data.createdAt;

    // Validate portfolio size if provided
    if (data.portfolioSize && data.portfolioSize < 0) {
      throw new ValidationErrors(
        null,
        'Portfolio size must be a positive number',
      );
    }

    return prisma.investorProfile.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            linkedInProfile: true,
            bio: true,
            expertise: true
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating investor profile: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if investor profile exists
    const exists = await prisma.investorProfile.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Investor profile with ID ${id} not found`);
    }

    await prisma.investorProfile.delete({
      where: { id },
    });

    return { message: 'Investor profile deleted successfully' };
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting investor profile: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
}; 