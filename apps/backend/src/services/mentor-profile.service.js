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
        { currentPosition: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [mentorProfiles, total] = await Promise.all([
      prisma.mentorProfile.findMany({
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
      prisma.mentorProfile.count({ where }),
    ]);

    return { data: mentorProfiles, total };
  } catch (error) {
    throw new Error(`Error fetching mentor profiles: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const mentorProfile = await prisma.mentorProfile.findUnique({
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

    if (!mentorProfile) {
      throw new NotFound(`Mentor profile with ID ${id} not found`);
    }

    return mentorProfile;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching mentor profile: ${error.message}`);
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

    // Check if mentor profile already exists for this user
    const existingProfile = await prisma.mentorProfile.findUnique({
      where: { userId: data.userId },
    });

    if (existingProfile) {
      throw new ValidationErrors(
        null,
        `Mentor profile already exists for user ${data.userId}`,
      );
    }

    // Validate years of experience if provided
    if (data.yearsOfExperience && data.yearsOfExperience < 0) {
      throw new ValidationErrors(
        null,
        'Years of experience must be a positive number',
      );
    }

    // Validate available hours if provided
    if (data.availableHours && data.availableHours < 0) {
      throw new ValidationErrors(
        null,
        'Available hours must be a positive number',
      );
    }

    return prisma.mentorProfile.create({
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
    throw new Error(`Error creating mentor profile: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Check if mentor profile exists
    const exists = await prisma.mentorProfile.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Mentor profile with ID ${id} not found`);
    }

    // Prevent updating certain fields
    delete data.id;
    delete data.userId;
    delete data.createdAt;

    // Validate years of experience if provided
    if (data.yearsOfExperience && data.yearsOfExperience < 0) {
      throw new ValidationErrors(
        null,
        'Years of experience must be a positive number',
      );
    }

    // Validate available hours if provided
    if (data.availableHours && data.availableHours < 0) {
      throw new ValidationErrors(
        null,
        'Available hours must be a positive number',
      );
    }

    return prisma.mentorProfile.update({
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
    throw new Error(`Error updating mentor profile: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if mentor profile exists
    const exists = await prisma.mentorProfile.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Mentor profile with ID ${id} not found`);
    }

    await prisma.mentorProfile.delete({
      where: { id },
    });

    return { message: 'Mentor profile deleted successfully' };
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting mentor profile: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
}; 