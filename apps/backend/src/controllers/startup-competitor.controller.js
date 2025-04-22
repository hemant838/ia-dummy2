const { startupCompetitorService } = require('../services');
const { BadRequest } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllStartupCompetitors = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { startupApplicationId, search } = req.query;

    const { data, total } = await startupCompetitorService.fetchAll({
      skip,
      take,
      startupApplicationId,
      search,
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
      'Startup competitors retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const getStartupCompetitorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup competitor ID is required');
    }

    const competitor = await startupCompetitorService.fetchById(id);
    return response.success(
      req,
      res,
      competitor,
      'Startup competitor retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const createStartupCompetitor = async (req, res, next) => {
  try {
    const payload = req.body;
    const competitor = await startupCompetitorService.create(payload);
    return response.success(
      req,
      res,
      competitor,
      'Startup competitor created successfully',
      201,
    );
  } catch (error) {
    return next(error);
  }
};

const updateStartupCompetitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Startup competitor ID is required');
    }

    const updated = await startupCompetitorService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Startup competitor updated successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const deleteStartupCompetitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup competitor ID is required');
    }

    const deleted = await startupCompetitorService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Startup competitor deleted successfully',
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllStartupCompetitors,
  getStartupCompetitorById,
  createStartupCompetitor,
  updateStartupCompetitor,
  deleteStartupCompetitor,
};
