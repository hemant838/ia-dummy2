const { contactService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, validateRequestBody } = require('../helpers');

getAllContacts = async (req, res, next) => {
  try {
    const result = await contactService.fetchAll();

    return response.success(req, res, result, 'success', 200);
  } catch (err) {
    return next(err);
  }
};

getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequest('ID is required');
    const result = await contactService.fetchById(id);
    if (!result) throw new NotFound(`ID ${id} not found`);

    return response.success(req, res, result, 'success', 201);
  } catch (err) {
    return next(err);
  }
};

createContact = async (req, res, next) => {
  try {
    const payload = req.body;

    // validateRequestBody('schemaName', payload);

    const result = await contactService.create(payload);

    return response.success(req, res, result, 'success', 201);
  } catch (err) {
    return next(err);
  }
};

updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // validateRequestBody('schemaName', payload);

    if (!id) throw new BadRequest('ID is required');
    const result = await contactService.update(id, payload);
    if (!result) throw new NotFound(`ID ${id} not found`);

    return response.success(req, res, result, 'success', 201);
  } catch (err) {
    return next(err);
  }
};

deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) throw new BadRequest('ID is required');
    const deleted = await contactService.remove(id);
    if (!deleted) throw new NotFound(`ID ${id} not found`);

    return response.success(req, res, deleted, 'success', 201);
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
