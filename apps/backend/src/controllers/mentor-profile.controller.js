const mentorProfileService = require('../services/mentor-profile.service');
const { BadRequest } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllMentorProfiles = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { userId, search } = req.query;

    const { data, total } = await mentorProfileService.fetchAll({
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
      'Mentor profiles retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const getMentorProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Mentor profile ID is required');
    }

    const mentorProfile = await mentorProfileService.fetchById(id);
    return response.success(
      req,
      res,
      mentorProfile,
      'Mentor profile retrieved successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const createMentorProfile = async (req, res, next) => {
  try {
    const payload = req.body;
    const mentorProfile = await mentorProfileService.create(payload);
    return response.success(
      req,
      res,
      mentorProfile,
      'Mentor profile created successfully',
      201,
    );
  } catch (error) {
    return next(error);
  }
};

const updateMentorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Mentor profile ID is required');
    }

    const updated = await mentorProfileService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Mentor profile updated successfully',
    );
  } catch (error) {
    return next(error);
  }
};

const deleteMentorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Mentor profile ID is required');
    }

    const deleted = await mentorProfileService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Mentor profile deleted successfully',
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllMentorProfiles,
  getMentorProfileById,
  createMentorProfile,
  updateMentorProfile,
  deleteMentorProfile,
}; 