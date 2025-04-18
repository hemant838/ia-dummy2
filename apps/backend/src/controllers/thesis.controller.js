const { thesisService } = require('../services');
const { BadRequest, NotFound } = require('../exceptions');
const { response, validateRequestBody } = require('../helpers');

getAllTheses = async (req, res, next) => {
  try {
    const data = await thesisService.fetchAll();
    return response.success(req, res, data, 'ok');
  } catch (err) {
    return next(err);
  }
};

getThesisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequest('ID is required');

    const data = await thesisService.fetchById(id);
    if (!data) throw new NotFound(`ID ${id} not found`);

    return response.success(req, res, data, 'success', 201);
  } catch (err) {
    return next(err);
  }
};

createThesis = async (req, res, next) => {
  try {
    const payload = req.body;
    // validateRequestBody('schemaName', payload);

    const data = await thesisService.create(payload);
    return response.success(req, res, data, 'created', 201);
  } catch (err) {
    return next(err);
  }
};

updateThesis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) throw new BadRequest('ID is required');
    const data = await thesisService.update(id, payload);
    if (!data) throw new NotFound(`ID ${id} not found`);

    return response.success(req, res, data, 'updated', 201);
  } catch (err) {
    return next(err);
  }
};

deleteThesis = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequest('ID is required');

    const data = await thesisService.remove(id);
    if (!data) throw new NotFound(`ID ${id} not found`);

    return response.success(req, res, data, 'deleted', 201);
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
