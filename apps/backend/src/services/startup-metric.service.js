const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip = 0, take = 10, startupApplicationId, metricType, startDate, endDate }) => {
  try {
    const where = {};

    if (startupApplicationId) where.startupApplicationId = startupApplicationId;
    if (metricType) where.metricType = metricType;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      prisma.startupMetric.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: {
          startupApplication: {
            select: {
              id: true,
              startup: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.startupMetric.count({ where }),
    ]);

    return { data, total };
  } catch (error) {
    throw new Error(`Error fetching startup metrics: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const metric = await prisma.startupMetric.findUnique({
      where: { id },
      include: {
        startupApplication: {
          select: {
            id: true,
            startup: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!metric) {
      throw new NotFound(`Startup metric with ID ${id} not found`);
    }

    return metric;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching startup metric: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = ['startupApplicationId', 'metricType', 'value', 'date'];
    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Check if startup application exists
    const application = await prisma.startupApplication.findUnique({
      where: { id: data.startupApplicationId },
    });
    if (!application) {
      throw new ValidationErrors(
        null,
        `Startup application with ID ${data.startupApplicationId} not found`,
      );
    }

    // Validate metric type
    const validMetricTypes = ['MRR', 'ARR', 'PROFIT', 'EBITDA', 'BURN'];
    if (!validMetricTypes.includes(data.metricType)) {
      throw new ValidationErrors(
        null,
        `Invalid metric type. Must be one of: ${validMetricTypes.join(', ')}`,
      );
    }

    // Validate value is a number
    if (isNaN(data.value)) {
      throw new ValidationErrors(null, 'Value must be a number');
    }

    // Validate date
    if (!(data.date instanceof Date) && isNaN(new Date(data.date))) {
      throw new ValidationErrors(null, 'Invalid date format');
    }

    return prisma.startupMetric.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: {
        startupApplication: {
          select: {
            id: true,
            startup: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating startup metric: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Check if metric exists
    const exists = await prisma.startupMetric.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup metric with ID ${id} not found`);
    }

    // Prevent changing startupApplicationId
    delete data.startupApplicationId;

    // Validate metric type if provided
    if (data.metricType) {
      const validMetricTypes = ['MRR', 'ARR', 'PROFIT', 'EBITDA', 'BURN'];
      if (!validMetricTypes.includes(data.metricType)) {
        throw new ValidationErrors(
          null,
          `Invalid metric type. Must be one of: ${validMetricTypes.join(', ')}`,
        );
      }
    }

    // Validate value if provided
    if (data.value !== undefined && isNaN(data.value)) {
      throw new ValidationErrors(null, 'Value must be a number');
    }

    // Validate date if provided
    if (data.date && !(data.date instanceof Date) && isNaN(new Date(data.date))) {
      throw new ValidationErrors(null, 'Invalid date format');
    }

    return prisma.startupMetric.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: {
        startupApplication: {
          select: {
            id: true,
            startup: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating startup metric: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if metric exists
    const exists = await prisma.startupMetric.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFound(`Startup metric with ID ${id} not found`);
    }

    return prisma.startupMetric.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting startup metric: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
}; 