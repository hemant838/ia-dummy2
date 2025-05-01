const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

const fetchAll = async ({ skip, take, stage, search }) => {
  try {
    const where = {};

    if (stage) {
      where.stage = stage;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [startups, total] = await Promise.all([
      prisma.startup.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          founders: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          thesis: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.startup.count({ where }),
    ]);

    // Collect all referredByIds
    const referredByIds = startups
      .map((startup) => startup?.referredById)
      .filter((id) => id);

    // Fetch all referredBy users in a single query
    const referredByUsers = await prisma.user.findMany({
      where: { id: { in: referredByIds } },
    });

    // Map referredBy users by ID
    const referredByMap = referredByUsers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    // Enrich data with referredBy users
    const enrichedData = startups.map((startup) => ({
      ...startup,
      referredBy: referredByMap[startup?.referredById] || null,
    }));

    return { data: enrichedData, total };
  } catch (error) {
    throw new Error(`Error fetching startups: ${error.message}`);
  }
};

const fetchById = async (id) => {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id },
      include: {
        founders: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        thesis: {
          select: {
            id: true,
            name: true,
          },
        },
        documents: true,
      },
    });

    if (!startup) {
      throw new NotFound(`Startup with ID ${id} not found`);
    }

    return startup;
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error fetching startup: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    // Validate required fields
    const required = [
      'organizationId',
      'thesisId',
      'verticalPartnerId',
      'name',
      'legalName',
      'foundedDate',
      'stage',
      'location',
    ];

    const missingFields = required.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationErrors(
        null,
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate relationships exist
    const [organization, thesis, verticalPartner] = await Promise.all([
      prisma.organization.findUnique({ where: { id: data.organizationId } }),
      prisma.thesis.findUnique({ where: { id: data.thesisId } }),
      prisma.user.findUnique({ where: { id: data.verticalPartnerId } }),
    ]);

    if (!organization) {
      throw new ValidationErrors(
        null,
        `Organization with ID ${data.organizationId} not found`,
      );
    }
    if (!thesis) {
      throw new ValidationErrors(
        null,
        `Thesis with ID ${data.thesisId} not found`,
      );
    }
    if (!verticalPartner) {
      throw new ValidationErrors(
        null,
        `Vertical Partner with ID ${data.verticalPartnerId} not found`,
      );
    }

    // Fetch thesisName if thesisId is provided and thesisName is not
    let resolvedThesisName = data.thesisName;
    if (data.thesisId && !data.thesisName) {
      const thesis = await prisma.thesis.findUnique({
        where: { id: data.thesisId },
      });
      if (!thesis) {
        throw new ValidationErrors(
          null,
          `Thesis with ID ${data.thesisId} not found`,
        );
      }
      resolvedThesisName = thesis.name;
    }

    // Fetch verticalPartnerName if verticalPartnerId is provided and verticalPartnerName is not
    let resolvedVerticalPartnerName = data.verticalPartnerName;
    if (data.verticalPartnerId && !data.verticalPartnerName) {
      const verticalPartner = await prisma.user.findUnique({
        where: { id: data.verticalPartnerId },
      });
      if (!verticalPartner) {
        throw new ValidationErrors(
          null,
          `Vertical Partner with ID ${data.verticalPartnerId} not found`,
        );
      }
      resolvedVerticalPartnerName = verticalPartner.name;
    }

    return prisma.startup.create({
      data: {
        ...data,
        thesisName: resolvedThesisName,
        verticalPartnerName: resolvedVerticalPartnerName,
      },
      include: {
        founders: true,
        thesis: true,
      },
    });
  } catch (error) {
    if (error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error creating startup: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    // Prevent updating id
    delete data.id;

    // Check if startup exists
    const exists = await prisma.startup.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Startup with ID ${id} not found`);
    }

    // Validate relationships if they're being updated
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

    if (data.thesisId) {
      const thesis = await prisma.thesis.findUnique({
        where: { id: data.thesisId },
      });
      if (!thesis) {
        throw new ValidationErrors(
          null,
          `Thesis with ID ${data.thesisId} not found`,
        );
      }
    }

    if (data.verticalPartnerId) {
      const verticalPartner = await prisma.user.findUnique({
        where: { id: data.verticalPartnerId },
      });
      if (!verticalPartner) {
        throw new ValidationErrors(
          null,
          `Vertical Partner with ID ${data.verticalPartnerId} not found`,
        );
      }
    }

    return prisma.startup.update({
      where: { id },
      data,
      include: {
        founders: true,
        thesis: true,
      },
    });
  } catch (error) {
    if (error instanceof NotFound || error instanceof ValidationErrors) {
      throw error;
    }
    throw new Error(`Error updating startup: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    // Check if startup exists
    const exists = await prisma.startup.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFound(`Startup with ID ${id} not found`);
    }

    return prisma.startup.delete({
      where: { id },
      include: {
        founders: true,
        thesis: true,
      },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      throw error;
    }
    throw new Error(`Error deleting startup: ${error.message}`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
};
