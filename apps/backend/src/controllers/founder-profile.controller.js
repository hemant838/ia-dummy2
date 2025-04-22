const { founderProfileService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllFounderProfiles = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { userId, startupId, search } = req.query;

    const { data, total } = await founderProfileService.fetchAll({
      skip,
      take,
      userId,
      startupId,
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
      'Contacts retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const getFounderProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Founder profile ID is required');
    }

    const founderProfile = await founderProfileService.fetchById(id);
    return response.success(
      req,
      res,
      founderProfile,
      'Founder profile retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const createFounderProfile = async (req, res, next) => {
  try {
    const payload = req.body;
    const founderProfile = await founderProfileService.create(payload);
    return response.success(
      req,
      res,
      founderProfile,
      'Founder profile created successfully',
      201,
    );
  } catch (error) {
    return next(error);
  }
};

const updateFounderProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Founder profile ID is required');
    }

    const updated = await founderProfileService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Founder profile updated successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const deleteFounderProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Contact ID is required');
    }

    const deleted = await founderProfileService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Founder profile deleted successfully',
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllFounderProfiles,
  getFounderProfileById,
  createFounderProfile,
  updateFounderProfile,
  deleteFounderProfile,
};
