const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({
  skip = 0,
  take = 10,
  startupId,
  documentType,
  search,
}) => {
  try {
    const where = {};

    if (startupId) where.startupId = startupId;
    if (documentType) where.documentType = documentType;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [startupDocument, total] = await Promise.all([
      prisma.startupDocument.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          startup: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.startupDocument.count({ where }),
    ]);

    return { data: startupDocument, total };
  } catch (error) {
    throw new Error(`Error fetching startup documents: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const document = await prisma.startupDocument.findUnique({
      where: { id },
      include: {
        startup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFound(`Startup document with ID ${id} not found`);
    }

    return document;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching startup document: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['startupId', 'documentType', 'name', 'fileUrl'];
    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate document type
    const validTypes = [
      'INVESTMENT_NOTE',
      'PITCH_DECK',
      'ONE_PAGER',
      'TERM_SHEET',
      'MANDATE_LETTER',
      'OTHER',
    ];
    if (!validTypes.includes(data.documentType)) {
      throw new ValidationErrors(
        null,
        `Invalid document type. Must be one of: ${validTypes.join(', ')}`,
      );
    }

    // Check if startup exists
    const startup = await prisma.startup.findUnique({
      where: { id: data.startupId },
    });
    if (!startup) {
      throw new ValidationErrors(
        null,
        `Startup with ID ${data.startupId} not found`,
      );
    }

    return prisma.startupDocument.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        startup: {
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
    throw new Error(`Error creating startup document: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Check if document exists
    const exists = await prisma.startupDocument.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup document with ID ${id} not found`);
    }

    // Prevent changing startupId
    delete data.startupId;

    // Validate document type if provided
    if (data.documentType) {
      const validTypes = [
        'INVESTMENT_NOTE',
        'PITCH_DECK',
        'ONE_PAGER',
        'TERM_SHEET',
        'MANDATE_LETTER',
        'OTHER',
      ];
      if (!validTypes.includes(data.documentType)) {
        throw new ValidationErrors(
          null,
          `Invalid document type. Must be one of: ${validTypes.join(', ')}`,
        );
      }
    }

    return prisma.startupDocument.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        startup: {
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
    throw new Error(`Error updating startup document: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if document exists
    const exists = await prisma.startupDocument.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup document with ID ${id} not found`);
    }

    return prisma.startupDocument.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting startup document: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
};
