const { programService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllPrograms = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { search } = req.query;

    const { data, total } = await programService.fetchAll({
      skip,
      take,
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
      'Programs retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const getProgramById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Program ID is required');
    }

    const program = await programService.fetchById(id);
    return response.success(
      req,
      res,
      program,
      'Program retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const createProgram = async (req, res, next) => {
  try {
    const payload = req.body;
    const newProgram = await programService.create(payload);
    return response.success(
      req,
      res,
      newProgram,
      'Program created successfully',
      201,
    );
  } catch (err) {
    return next(err);
  }
};

const updateProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Program ID is required');
    }

    const updated = await programService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Program updated successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const deleteProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Program ID is required');
    }

    const deleted = await programService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Program deleted successfully',
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
}; 