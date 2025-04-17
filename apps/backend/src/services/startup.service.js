const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors } = require('../exceptions');

fetchAll = async () => {
  const result = await prisma.startup.findMany();

  return result;
};

fetchById = async (id) => {
  return prisma.startup.findUnique({ where: { id } });
};

create = async (data) => {
  // Example validation: ensure required fields
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

  for (const field of required) {
    if (!data[field]) {
      throw new ValidationErrors(null, `${field} is required`);
    }
  }

  return prisma.startup.create({ data });
};

update = async (id, data) => {
  // Prevent updating id
  delete data.id;
  try {
    return prisma.startup.update({ where: { id }, data });
  } catch (err) {
    if (err.code === 'P2025') {
      // record not found
      throw new ValidationErrors(null, `${id} record not found`);
    }
    throw err;
  }
};

remove = async (id) => {
  try {
    const result = await prisma.startup.delete({ where: { id } });
    return result;
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ValidationErrors(null, `${id} record not found`);
    }
    throw err;
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
};
