const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors, NotFound } = require('../exceptions');

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
      // throw new ValidationErrors(`${field} is required`);

      throw new ValidationErrors(null, `${field} is required`);
    }
  }
  // Optional: more validation via Zod or validator.helper

  return prisma.testModel.create({ data });
};

update = async (id, data) => {
  // Prevent updating id
  delete data.id;
  try {
    return prisma.startup.update({ where: { id }, data });
  } catch (err) {
    if (err.code === 'P2025') {
      // record not found
      return null;
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
      return null;
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
