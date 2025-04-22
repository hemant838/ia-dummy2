const { startupStageChangeService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

/**
 * Get all startup stage changes with pagination and filters
 */
const getAllStartupStageChanges = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { startupId, fromStage, toStage, search } = req.query;

    const { data, total } = await startupStageChangeService.fetchAll({
      skip,
      take,
      startupId,
      fromStage,
      toStage,
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
      'Startup stage changes retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Get a startup stage change by ID
 */
const getStartupStageChangeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup stage change ID is required');
    }

    const stageChange = await startupStageChangeService.fetchById(id);
    return response.success(
      req,
      res,
      stageChange,
      'Startup stage change retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Create a new startup stage change
 */
const createStartupStageChange = async (req, res, next) => {
  try {
    const payload = req.body;
    const stageChange = await startupStageChangeService.create(payload);
    return response.success(
      req,
      res,
      stageChange,
      'Startup stage change created successfully',
      201,
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a startup stage change
 */
const updateStartupStageChange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Startup stage change ID is required');
    }

    const updated = await startupStageChangeService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Startup stage change updated successfully',
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete a startup stage change
 */
const deleteStartupStageChange = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup stage change ID is required');
    }

    const deleted = await startupStageChangeService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Startup stage change deleted successfully',
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllStartupStageChanges,
  getStartupStageChangeById,
  createStartupStageChange,
  updateStartupStageChange,
  deleteStartupStageChange,
};
