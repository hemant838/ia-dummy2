const { contactService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, pagination } = require('../helpers');

const getAllContacts = async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = pagination.getPaginationParams(
      req.query,
    );
    const { record, stage, search, userType } = req.query;

    const { data, total } = await contactService.fetchAll({
      skip,
      take,
      record,
      stage,
      search,
      userType,
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
  } catch (err) {
    return next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Contact ID is required');
    }

    const contact = await contactService.fetchById(id);
    return response.success(
      req,
      res,
      contact,
      'Contact retrieved successfully',
    );
  } catch (err) {
    return next(err);
  }
};

const createContact = async (req, res, next) => {
  try {
    const payload = req.body;
    const newContact = await contactService.create(payload);
    return response.success(
      req,
      res,
      newContact,
      'Contact created successfully',
      201,
    );
  } catch (err) {
    return next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new BadRequest('Contact ID is required');
    }

    const updated = await contactService.update(id, payload);
    return response.success(req, res, updated, 'Contact updated successfully');
  } catch (err) {
    return next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequest('Contact ID is required');
    }

    const deleted = await contactService.remove(id);
    return response.success(req, res, deleted, 'Contact deleted successfully');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
