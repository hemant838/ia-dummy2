const appConfig = require('../configs/app.config');
const { OK, HTTP_200 } = require('../constant');
const response = require('../helpers/response.helper');
const controller = {};

controller.index = (req, res) =>
  response.success(req, res, {
    version: appConfig.version,
  });

controller.health = (req, res) => {
  res.status(HTTP_200);
  res.setHeader('Content-Type', `application/json`);
  res.send({ status: OK, baseUrl: req.baseUrl });
};

module.exports = controller;
