const { startupMetricService } = require('../services');
const { BadRequest } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllStartupMetrics = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { startupApplicationId, metricType, startDate, endDate } = req.query;

    const { data, total } = await startupMetricService.fetchAll({
      skip,
      take,
      startupApplicationId,
      metricType,
      startDate,
      endDate,
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
      'Startup metrics retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const getStartupMetricById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup metric ID is required');
    }

    const metric = await startupMetricService.fetchById(id);
    return response.success(
      req,
      res,
      metric,
      'Startup metric retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const createStartupMetric = async (req, res, next) => {
  try {
    const payload = req.body;
    const metric = await startupMetricService.create(payload);
    return response.success(
      req,
      res,
      metric,
      'Startup metric created successfully',
      201,
    );
  } catch (error) {
    return next(error);
  }
};

const updateStartupMetric = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Startup metric ID is required');
    }

    const updated = await startupMetricService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Startup metric updated successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const deleteStartupMetric = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup metric ID is required');
    }

    const deleted = await startupMetricService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Startup metric deleted successfully',
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllStartupMetrics,
  getStartupMetricById,
  createStartupMetric,
  updateStartupMetric,
  deleteStartupMetric,
};
