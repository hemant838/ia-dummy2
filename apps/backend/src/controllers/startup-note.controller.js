const { startupNoteService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllStartupNotes = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { startupApplicationId, userId, search } = req.query;

    const { data, total } = await startupNoteService.fetchAll({
      skip,
      take,
      startupApplicationId,
      userId,
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
      'Startup note retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const getStartupNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup note ID is required');
    }

    const note = await startupNoteService.fetchById(id);
    return response.success(
      req,
      res,
      note,
      'Startup note retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const createStartupNote = async (req, res, next) => {
  try {
    const payload = req.body;
    const note = await startupNoteService.create(payload);
    return response.success(
      req,
      res,
      note,
      'Startup note created successfully',
      201,
    );
  } catch (error) {
    return next(error);
  }
};

const updateStartupNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Startup note is required');
    }

    const updated = await startupNoteService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Startup note updated successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const deleteStartupNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Startup note ID is required');
    }

    const deleted = await startupNoteService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Startup note deleted successfully',
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllStartupNotes,
  getStartupNoteById,
  createStartupNote,
  updateStartupNote,
  deleteStartupNote,
};
