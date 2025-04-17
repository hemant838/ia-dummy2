const { startupService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, validateRequestBody } = require('../helpers');

getAllStartups = async (req, res, next) => {
  try {
    const startups = await startupService.fetchAll();

    return response.success(req, res, startups, 'ok');
  } catch (err) {
    return next(err);
  }
};

getStartupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequest('ID is required');
    const startup = await startupService.fetchById(id);
    if (!startup) throw new NotFound(`ID ${id} not found`);

    return response.success(req, res, startup, 'success', 201);
  } catch (err) {
    return next(err);
  }
};

createStartup = async (req, res, next) => {
  try {
    const payload = req.body;

    // validateRequestBody('schemaName', payload);

    const newStartup = await startupService.create(payload);

    return response.success(req, res, newStartup, 'success', 201);
  } catch (err) {
    return next(err);
  }
};

updateStartup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // validateRequestBody('schemaName', payload);

    if (!id) throw new BadRequest('ID is required');
    const updated = await startupService.update(id, payload);
    if (!updated) throw new NotFound(`ID ${id} not found`);

    return response.success(req, res, updated, 'success', 201);
  } catch (err) {
    return next(err);
  }
};

deleteStartup = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequest('ID is required');
    const deleted = await startupService.remove(id);
    if (!deleted) throw new NotFound(`ID ${id} not found`);

    return response.success(req, res, deleted, 'success', 201);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllStartups,
  getStartupById,
  createStartup,
  updateStartup,
  deleteStartup,
};
