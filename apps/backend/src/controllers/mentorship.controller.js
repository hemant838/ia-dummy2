const { mentorshipService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllMentorships = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { mentorId, startupId, active, search } = req.query;

    const { data, total } = await mentorshipService.fetchAll({
      skip,
      take,
      mentorId,
      startupId,
      active: active === 'true',
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
      'Mentorships retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const getMentorshipById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Mentorship ID is required');
    }

    const mentorship = await mentorshipService.fetchById(id);
    return response.success(
      req,
      res,
      mentorship,
      'Mentorship retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const createMentorship = async (req, res, next) => {
  try {
    const payload = req.body;
    const newMentorship = await mentorshipService.create(payload);
    return response.success(
      req,
      res,
      newMentorship,
      'Mentorship created successfully',
      201,
    );
  } catch (err) {
    return next(err);
  }
};

const updateMentorship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Mentorship ID is required');
    }

    const updated = await mentorshipService.update(id, payload);
    return response.success(
      req,
      res,
      updated,
      'Mentorship updated successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const deleteMentorship = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Mentorship ID is required');
    }

    const deleted = await mentorshipService.remove(id);
    return response.success(
      req,
      res,
      deleted,
      'Mentorship deleted successfully',
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllMentorships,
  getMentorshipById,
  createMentorship,
  updateMentorship,
  deleteMentorship,
}; 