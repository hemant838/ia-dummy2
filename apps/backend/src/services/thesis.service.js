const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors } = require('../exceptions');

fetchAll = async () => {
  const result = await prisma.thesis.findMany();
  return result;
};

fetchById = async (id) => {
  return prisma.thesis.findUnique({ where: { id } });
};

create = async (data) => {
  const required = ['name', 'ownerId'];

  for (const field of required) {
    if (!data[field]) {
      throw new ValidationErrors(null, `${field} is required`);
    }
  }

  return prisma.thesis.create({ data });
};

update = async (id, data) => {
  delete data.id;
  try {
    return await prisma.thesis.update({ where: { id }, data });
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ValidationErrors(null, `${id} record not found`);
    }
    throw err;
  }
};

remove = async (id) => {
  try {
    const result = await prisma.thesis.delete({ where: { id } });
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
