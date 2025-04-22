const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip, take, investorId, startupId, type, search }) => {
  try {
    const where = {};

    if (investorId) {
      where.investorId = investorId;
    }

    if (startupId) {
      where.startupId = startupId;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [investments, total] = await Promise.all([
      prisma.investment.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: {
          investor: {
            select: {
              id: true,
              name: true,
              email: true,
              investorProfile: true,
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
      prisma.investment.count({ where }),
    ]);

    return { data: investments, total };
  } catch (error) {
    throw new Error(`Error fetching investments: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const investment = await prisma.investment.findUnique({
      where: { id },
      include: {
        investor: {
          select: {
            id: true,
            name: true,
            email: true,
            investorProfile: true,
          },
        },
        startup: {
          select: {
            id: true,
            name: true,
            stage: true,
            description: true,
          },
        },
      },
    });

    if (!investment) {
      throw new NotFound(`Investment with ID ${id} not found`);
    }

    return investment;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching investment: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['investorId', 'startupId', 'amount', 'type', 'date'];

    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate relationships exist
    const [investor, startup] = await Promise.all([
      prisma.user.findUnique({
        where: { id: data.investorId },
        include: { investorProfile: true },
      }),
      prisma.startup.findUnique({ where: { id: data.startupId } }),
    ]);

    if (!investor) {
      throw new ValidationErrors(
        null,
        `Investor with ID ${data.investorId} not found`,
      );
    }
    if (!investor.investorProfile) {
      throw new ValidationErrors(
        null,
        `User ${data.investorId} is not an investor`,
      );
    }
    if (!startup) {
      throw new ValidationErrors(
        null,
        `Startup with ID ${data.startupId} not found`,
      );
    }

    // Validate numeric fields
    if (data.equityPercentage && (data.equityPercentage < 0 || data.equityPercentage > 100)) {
      throw new ValidationErrors(
        null,
        'Equity percentage must be between 0 and 100',
      );
    }

    return prisma.investment.create({
      data,
      include: {
        investor: {
          select: {
            id: true,
            name: true,
            email: true,
            investorProfile: true,
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
    throw new Error(`Error creating investment: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Prevent updating id, investorId, and startupId
    delete data.id;
    delete data.investorId;
    delete data.startupId;

    // Check if investment exists
    const exists = await prisma.investment.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Investment with ID ${id} not found`);
    }

    // Validate numeric fields
    if (data.equityPercentage && (data.equityPercentage < 0 || data.equityPercentage > 100)) {
      throw new ValidationErrors(
        null,
        'Equity percentage must be between 0 and 100',
      );
    }

    return prisma.investment.update({
      where: { id },
      data,
      include: {
        investor: {
          select: {
            id: true,
            name: true,
            email: true,
            investorProfile: true,
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
    throw new Error(`Error updating investment: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if investment exists
    const exists = await prisma.investment.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Investment with ID ${id} not found`);
    }

    return prisma.investment.delete({
      where: { id },
      include: {
        investor: {
          select: {
            id: true,
            name: true,
            email: true,
            investorProfile: true,
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
    throw new Error(`Error deleting investment: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
}; 