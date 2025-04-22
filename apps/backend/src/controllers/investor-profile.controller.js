const investorProfileService = require('../services/investor-profile.service');
const { BadRequest } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllInvestorProfiles = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { userId, search } = req.query;

    const { data, total } = await investorProfileService.fetchAll({
      skip,
      take,
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
      'Investor profiles retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const getInvestorProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Investor profile ID is required');
    }

    const investorProfile = await investorProfileService.fetchById(id);
    return response.success(
      req,
      res,
      investorProfile,
      'Investor profile retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const createInvestorProfile = async (req, res, next) => {
  try {
    const payload = req.body;
    const investorProfile = await investorProfileService.create(payload);
    return response.success(
      req,
      res,
      investorProfile,
      'Investor profile created successfully',
      201,
    );
  } catch (error) {
    return next(error);
  }
};

const updateInvestorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Investor profile ID is required');
    }

    const updated = await investorProfileService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Investor profile updated successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const deleteInvestorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Investor profile ID is required');
    }

    const deleted = await investorProfileService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Investor profile deleted successfully',
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllInvestorProfiles,
  getInvestorProfileById,
  createInvestorProfile,
  updateInvestorProfile,
  deleteInvestorProfile,
}; 