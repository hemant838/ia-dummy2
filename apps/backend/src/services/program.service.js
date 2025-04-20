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
        { programType: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          startups: {
            select: {
              id: true,
              name: true,
              stage: true,
            },
          },
          events: {
            select: {
              id: true,
              name: true,
              date: true,
              eventType: true,
            },
          },
        },
      }),
      prisma.program.count({ where }),
    ]);

    return { data: programs, total };
  } catch (error) {
    throw new Error(`Error fetching programs: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        startups: {
          select: {
            id: true,
            name: true,
            stage: true,
            description: true,
            foundedDate: true,
            location: true,
          },
        },
        events: {
          select: {
            id: true,
            name: true,
            description: true,
            date: true,
            endDate: true,
            location: true,
            virtualLink: true,
            capacity: true,
            eventType: true,
          },
        },
      },
    });

    if (!program) {
      throw new NotFound(`Program with ID ${id} not found`);
    }

    return program;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching program: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = [
      'organizationId',
      'name',
      'description',
      'startDate',
      'endDate',
      'programType',
    ];

    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: data.organizationId },
    });

    if (!organization) {
      throw new ValidationErrors(
        null,
        `Organization with ID ${data.organizationId} not found`,
      );
    }

    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (endDate < startDate) {
      throw new ValidationErrors(
        null,
        'End date cannot be earlier than start date',
      );
    }

    return prisma.program.create({
      data,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating program: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Prevent updating id
    delete data.id;

    // Check if program exists
    const exists = await prisma.program.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Program with ID ${id} not found`);
    }

    // Validate organization if being updated
    if (data.organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: data.organizationId },
      });
      if (!organization) {
        throw new ValidationErrors(
          null,
          `Organization with ID ${data.organizationId} not found`,
        );
      }
    }

    // Validate dates if being updated
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      if (endDate < startDate) {
        throw new ValidationErrors(
          null,
          'End date cannot be earlier than start date',
        );
      }
    }

    return prisma.program.update({
      where: { id },
      data,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating program: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if program exists
    const exists = await prisma.program.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Program with ID ${id} not found`);
    }

    // Check if program has any startups or events
    const [hasStartups, hasEvents] = await Promise.all([
      prisma.startup.count({ where: { programs: { some: { id } } } }),
      prisma.event.count({ where: { programId: id } }),
    ]);

    if (hasStartups > 0) {
      throw new ValidationErrors(
        null,
        `Cannot delete program with associated startups`,
      );
    }

    if (hasEvents > 0) {
      throw new ValidationErrors(
        null,
        `Cannot delete program with associated events`,
      );
    }

    return prisma.program.delete({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error deleting program: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
}; 