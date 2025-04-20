const { organizationService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllOrganizations = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { search } = req.query;

    const { data, total } = await organizationService.fetchAll({
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
      'Organizations retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const getOrganizationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Organization ID is required');
    }

    const organization = await organizationService.fetchById(id);
    return response.success(
      req,
      res,
      organization,
      'Organization retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const createOrganization = async (req, res, next) => {
  try {
    const payload = req.body;
    const newOrganization = await organizationService.create(payload);
    return response.success(
      req,
      res,
      newOrganization,
      'Organization created successfully',
      201,
    );
  } catch (err) {
    return next(err);
  }
};

const updateOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Organization ID is required');
    }

    const updated = await organizationService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Organization updated successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const deleteOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Organization ID is required');
    }

    const deleted = await organizationService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Organization deleted successfully',
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
}; 