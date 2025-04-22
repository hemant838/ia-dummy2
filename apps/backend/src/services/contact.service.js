const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip, take, record, stage, search }) => {
  try {
    const where = {};

    if (record) {
      where.record = record;
    }

    if (stage) {
      where.stage = stage;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true,
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return { data: contacts, total };
  } catch (error) {
    throw new Error(`Error fetching contacts: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
        notes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        tasks: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        activities: {
          orderBy: {
            occurredAt: 'desc',
          },
        },
      },
    });

    if (!contact) {
      throw new NotFound(`Contact with ID ${id} not found`);
    }

    return contact;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }

    throw new Error(`Error fetching contact: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['organizationId', 'userId', 'name', 'record'];

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

    // If userId is provided, validate user exists
    if (data.userId) {
      const user = await prisma.contact.findUnique({
        where: { userId: data.userId },
      });
      if (user) {
        throw new ValidationErrors(
          null,
          `User with ID ${data.userId} already exist`,
        );
      }
    }

    return prisma.contact.create({
      data,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating contact: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Prevent updating id
    delete data.id;

    // Check if contact exists
    const exists = await prisma.contact.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Contact with ID ${id} not found`);
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

    // Validate user if being updated
    if (data.userId) {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });
      if (!user) {
        throw new ValidationErrors(
          null,
          `User with ID ${data.userId} not found`,
        );
      }
    }

    return prisma.contact.update({
      where: { id },
      data,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating contact: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if contact exists
    const exists = await prisma.contact.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Contact with ID ${id} not found`);
    }

    return prisma.contact.delete({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: true,
      },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting contact: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
};
