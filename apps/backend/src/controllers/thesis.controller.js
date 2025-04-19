const { thesisService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllTheses = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { search } = req.query;

    const { data, total } = await thesisService.fetchAll({
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
      'Theses retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const getThesisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Thesis ID is required');
    }

    const thesis = await thesisService.fetchById(id);
    return response.success(req, res, thesis, 'Thesis retrieved successfully');
  } catch (err) {
    return next(err);
  }
};

const createThesis = async (req, res, next) => {
  try {
    const payload = req.body;
    const newThesis = await thesisService.create(payload);
    return response.success(
      req,
      res,
      newThesis,
      'Thesis created successfully',
      201,
    );
  } catch (err) {
    return next(err);
  }
};

const updateThesis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Thesis ID is required');
    }

    const updated = await thesisService.update(id, payload);
    return response.success(req, res, updated, 'Thesis updated successfully');
  } catch (err) {
    return next(err);
  }
};

const deleteThesis = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Thesis ID is required');
    }

    const deleted = await thesisService.remove(id);
    return response.success(req, res, deleted, 'Thesis deleted successfully');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllTheses,
  getThesisById,
  createThesis,
  updateThesis,
  deleteThesis,
};
