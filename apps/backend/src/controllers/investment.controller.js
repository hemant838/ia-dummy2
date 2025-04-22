const { investmentService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllInvestments = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { investorId, startupId, type, search } = req.query;

    const { data, total } = await investmentService.fetchAll({
      skip,
      take,
      investorId,
      startupId,
      type,
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
      'Investments retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const getInvestmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Investment ID is required');
    }

    const investment = await investmentService.fetchById(id);
    return response.success(
      req,
      res,
      investment,
      'Investment retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const createInvestment = async (req, res, next) => {
  try {
    const payload = req.body;
    const newInvestment = await investmentService.create(payload);
    return response.success(
      req,
      res,
      newInvestment,
      'Investment created successfully',
      201,
    );
  } catch (err) {
    return next(err);
  }
};

const updateInvestment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Investment ID is required');
    }

    const updated = await investmentService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Investment updated successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const deleteInvestment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Investment ID is required');
    }

    const deleted = await investmentService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Investment deleted successfully',
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment,
};
