const { startupService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllStartups = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { stage, search, evaluationStage } = req.query;

    const { data, total } = await startupService.fetchAll({
      skip,
      take,
      stage,
      search,
      evaluationStage,
    });

    const paginatedResponse = pagination.getPaginatedResponse(
      data,
      total,
      page,
      pageSize,
    );
    return response.success(
      req,
      res,
      paginatedResponse,
      'Startups retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const getStartupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup ID is required');
    }

    const startup = await startupService.fetchById(id);
    return response.success(
      req,
      res,
      startup,
      'Startup retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const createStartup = async (req, res, next) => {
  try {
    const payload = req.body;
    const newStartup = await startupService.create(payload);
    return response.success(
      req,
      res,
      newStartup,
      'Startup created successfully',
      201,
    );
  } catch (err) {
    return next(err);
  }
};

const updateStartup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Startup ID is required');
    }

    const updated = await startupService.update(id, payload);
    return response.success(req, res, updated, 'Startup updated successfully');
  } catch (err) {
    return next(err);
  }
};

const deleteStartup = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup ID is required');
    }

    const deleted = await startupService.remove(id);
    return response.success(req, res, deleted, 'Startup deleted successfully');
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
