const { startupService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const response = require('../helpers/response.helper');

getAllStartups = async (req, res, next) => {
  try {
    const startups = await startupService.fetchAll();

    response.success(req, res, {
      result: startups,
    });
  } catch (err) {
    next(err);
  }
};

getStartupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequest('Startup ID is required');
    const startup = await startupService.fetchById(id);
    if (!startup) throw new NotFound(`Startup with ID ${id} not found`);

    response.success(req, res, {
      result: startups,
    });
  } catch (err) {
    next(err);
  }
};

createStartup = async (req, res, next) => {
  try {
    const payload = req.body;
    // TODO: validate payload with Zod or validator.helper
    const newStartup = await startupService.create(payload);

    response.success(
      req,
      res,
      {
        result: newStartup,
      },
      'success',
      201,
    );
  } catch (err) {
    next(err);
  }
};

updateStartup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (!id) throw new BadRequest('Startup ID is required');
    const updated = await startupService.update(id, payload);
    if (!updated) throw new NotFound(`Startup with ID ${id} not found`);

    response.success(
      req,
      res,
      {
        result: updated,
      },
      'success',
      201,
    );
  } catch (err) {
    next(err);
  }
};

deleteStartup = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequest('Startup ID is required');
    const deleted = await startupService.remove(id);
    if (!deleted) throw new NotFound(`Startup with ID ${id} not found`);

    response.success(req, res, {}, 'success', 204);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllStartups,
  getStartupById,
  createStartup,
  updateStartup,
  deleteStartup,
};
