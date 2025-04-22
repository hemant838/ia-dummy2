const { eventService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllEvents = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { programId, eventType, search, upcoming } = req.query;

    const { data, total } = await eventService.fetchAll({
      skip,
      take,
      programId,
      eventType,
      search,
      upcoming: upcoming === 'true',
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
      'Events retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Event ID is required');
    }

    const event = await eventService.fetchById(id);
    return response.success(req, res, event, 'Event retrieved successfully');
  } catch (err) {
    return next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const payload = req.body;
    const newEvent = await eventService.create(payload);
    return response.success(
      req,
      res,
      newEvent,
      'Event created successfully',
      201,
    );
  } catch (err) {
    return next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Event ID is required');
    }

    const updated = await eventService.update(id, payload);
    return response.success(req, res, updated, 'Event updated successfully');
  } catch (err) {
    return next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Event ID is required');
    }

    const deleted = await eventService.remove(id);
    return response.success(req, res, deleted, 'Event deleted successfully');
  } catch (err) {
    return next(err);
  }
};

const addAttendee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!id) {
      throw new BadRequest('Event ID is required');
    }
    if (!userId) {
      throw new BadRequest('User ID is required');
    }

    const updated = await eventService.addAttendee(id, userId);
    return response.success(req, res, updated, 'Attendee added successfully');
  } catch (err) {
    return next(err);
  }
};

const removeAttendee = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    if (!id) {
      throw new BadRequest('Event ID is required');
    }
    if (!userId) {
      throw new BadRequest('User ID is required');
    }

    const updated = await eventService.removeAttendee(id, userId);
    return response.success(req, res, updated, 'Attendee removed successfully');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addAttendee,
  removeAttendee,
};
