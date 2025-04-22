const { startupDocumentService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllStartupDocuments = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );

    const { startupId, documentType, search } = req.query;

    const { data, total } = await startupDocumentService.fetchAll({
      skip,
      take,
      startupId,
      documentType,
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
      'Startup document retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const getStartupDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Document ID is required');
    }

    const document = await startupDocumentService.fetchById(id);
    return response.success(
      req,
      res,
      document,
      'Document retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const createStartupDocument = async (req, res, next) => {
  try {
    const payload = req.body;
    const document = await startupDocumentService.create(payload);
    return response.success(
      req,
      res,
      document,
      'Document created successfully',
      201,
    );
  } catch (error) {
    return next(error);
  }
};

const updateStartupDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Document ID is required');
    }

    const document = await startupDocumentService.update(id, payload);
    return response.success(
      req,
      res,
      document,
      'Document updated successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const deleteStartupDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Document ID is required');
    }

    const deleted = await startupDocumentService.remove(id);
    return response.success(req, res, deleted, 'Document deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStartupDocuments,
  getStartupDocumentById,
  createStartupDocument,
  updateStartupDocument,
  deleteStartupDocument,
};
