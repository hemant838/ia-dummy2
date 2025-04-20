const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({
  skip,
  take,
  mentorId,
  startupId,
  active,
  search,
}) => {
  try {
    const where = {};

    if (mentorId) {
      where.mentorId = mentorId;
    }

    if (startupId) {
      where.startupId = startupId;
    }

    if (active) {
      where.OR = [{ endDate: null }, { endDate: { gt: new Date() } }];
    }

    if (search) {
      where.OR = [
        { focusAreas: { has: search } },
        { meetingCadence: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [mentorships, total] = await Promise.all([
      prisma.mentorship.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              expertise: true,
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
      prisma.mentorship.count({ where }),
    ]);

    return { data: mentorships, total };
  } catch (error) {
    throw new Error(`Error fetching mentorships: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const mentorship = await prisma.mentorship.findUnique({
      where: { id },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            expertise: true,
            mentorProfile: true,
          },
        },
        startup: {
          select: {
            id: true,
            name: true,
            stage: true,
            description: true,
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

    if (!mentorship) {
      throw new NotFound(`Mentorship with ID ${id} not found`);
    }

    return mentorship;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching mentorship: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['mentorId', 'startupId', 'startDate', 'focusAreas'];

    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate relationships exist
    const [mentor, startup] = await Promise.all([
      prisma.user.findUnique({
        where: { id: data.mentorId },
        include: { mentorProfile: true },
      }),
      prisma.startup.findUnique({ where: { id: data.startupId } }),
    ]);

    if (!mentor) {
      throw new ValidationErrors(
        null,
        `Mentor with ID ${data.mentorId} not found`,
      );
    }

    // ####### UNCOMMENT BELOW CONDITION WHEN NEEDED #######

    // if (!mentor.mentorProfile) {
    //   throw new ValidationErrors(
    //     null,
    //     `User ${data.mentorId} is not a mentor`,
    //   );
    // }
    if (!startup) {
      throw new ValidationErrors(
        null,
        `Startup with ID ${data.startupId} not found`,
      );
    }

    // Check if mentorship already exists
    const existing = await prisma.mentorship.findFirst({
      where: {
        mentorId: data.mentorId,
        startupId: data.startupId,
      },
    });

    if (existing) {
      throw new ValidationErrors(
        null,
        `Mentorship between mentor ${data.mentorId} and startup ${data.startupId} already exists`,
      );
    }

    return prisma.mentorship.create({
      data,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            expertise: true,
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
    throw new Error(`Error creating mentorship: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Prevent updating id, mentorId, and startupId
    delete data.id;
    delete data.mentorId;
    delete data.startupId;

    // Check if mentorship exists
    const exists = await prisma.mentorship.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Mentorship with ID ${id} not found`);
    }

    // Validate dates if being updated
    if (data.startDate && exists.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(exists.endDate);
      if (startDate > endDate) {
        throw new ValidationErrors(
          null,
          'Start date cannot be later than end date',
        );
      }
    }
    if (data.endDate) {
      const startDate = new Date(data.startDate || exists.startDate);
      const endDate = new Date(data.endDate);
      if (startDate > endDate) {
        throw new ValidationErrors(
          null,
          'End date cannot be earlier than start date',
        );
      }
    }

    return prisma.mentorship.update({
      where: { id },
      data,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            expertise: true,
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
    throw new Error(`Error updating mentorship: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if mentorship exists
    const exists = await prisma.mentorship.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Mentorship with ID ${id} not found`);
    }

    return prisma.mentorship.delete({
      where: { id },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            expertise: true,
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
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting mentorship: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
};
