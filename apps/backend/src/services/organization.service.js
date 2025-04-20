const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip, take, search }) => {
  try {
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          startups: {
            select: {
              id: true,
              name: true,
              stage: true,
            },
          },
        },
      }),
      prisma.organization.count({ where }),
    ]);

    return { data: organizations, total };
  } catch (error) {
    throw new Error(`Error fetching organizations: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
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
        programs: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            programType: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFound(`Organization with ID ${id} not found`);
    }

    return organization;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching organization: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['name', 'stripeCustomerId'];

    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    return prisma.organization.create({
      data,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating organization: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Prevent updating id
    delete data.id;

    // Check if organization exists
    const exists = await prisma.organization.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Organization with ID ${id} not found`);
    }

    return prisma.organization.update({
      where: { id },
      data,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating organization: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if organization exists
    const exists = await prisma.organization.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Organization with ID ${id} not found`);
    }

    // Check if organization has any users or startups
    const [hasUsers, hasStartups] = await Promise.all([
      prisma.user.count({ where: { organizationId: id } }),
      prisma.startup.count({ where: { organizationId: id } }),
    ]);

    if (hasUsers > 0) {
      throw new ValidationErrors(
        null,
        `Cannot delete organization with associated users`,
      );
    }

    if (hasStartups > 0) {
      throw new ValidationErrors(
        null,
        `Cannot delete organization with associated startups`,
      );
    }

    return prisma.organization.delete({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error deleting organization: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
}; 