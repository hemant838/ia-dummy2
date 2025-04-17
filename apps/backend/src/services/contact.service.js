const { PrismaClient } = require('@workspace/database/backend-prisma-client');
const prisma = new PrismaClient();
const { ValidationErrors } = require('../exceptions');

fetchAll = async () => {
  try {
    const result = await prisma.contact.findMany();

    return result;
  } catch (err) {
    throw err;
  }
};

fetchById = async (id) => {
  try {
    return await prisma.contact.findUnique({ where: { id } });
  } catch (err) {
    throw err;
  }
};

create = async (data) => {
  const required = ['organizationId', 'record', 'name', 'stage'];

  for (const field of required) {
    if (!data[field]) {
      throw new ValidationErrors(null, `${field} is required`);
    }
  }

  try {
    return await prisma.contact.create({ data });
  } catch (err) {
    throw new ValidationErrors(err, `Something went wrong`);
  }
};

update = async (id, data) => {
  delete data.id;
  try {
    return await prisma.contact.update({ where: { id }, data });
  } catch (err) {
    if (err.code === 'P2025') return null;
    throw new ValidationErrors(null, `${id} record not found`);
  }
};

remove = async (id) => {
  try {
    return await prisma.contact.delete({ where: { id } });
  } catch (err) {
    if (err.code === 'P2025') return null;
    throw new ValidationErrors(null, `${id} record not found`);
  }
};

module.exports = {
  fetchAll,
  fetchById,
  create,
  update,
  remove,
};
