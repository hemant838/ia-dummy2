const exceptions = require('../exceptions');

// eslint-disable-next-line max-statements
const finalResponse = (req, res, message, data, code = 200) => {
  const statusCode = Number.isInteger(code) ? code : 500; // fallback if code is invalid
  const isSuccess = statusCode.toString().startsWith('2');

  const status = code.toString().startsWith('2');
  const responseData = {
    code,
    data,
    message,
    status: isSuccess,
  };
  if (!isSuccess) responseData.requestData = req.body;

  res.status(statusCode);
  res.setHeader('Content-Type', `application/json`);
  res.setHeader('X-SW-Request-Id', req.requestId || 0);
  res.send(responseData);
};

const success = (
  req,
  res,
  data = null,
  message = 'Success',
  httpCode = 200,
) => {
  finalResponse(req, res, message, data, httpCode);
};

const failed = (req, res, message = 'Failed', data = null, httpCode = 500) => {
  finalResponse(req, res, message, data, httpCode);
};

const handler404 = (req, res, next) => next(new exceptions.NotFound('Path'));

const handler5xx = function (err, req, res, next) {
  let message = err.message || 'Internal server error';
  if (typeof err.status === 'undefined' || err.status === 500) {
    message = 'Internal server error';
    console.error(message, err, req.requestId, true);
  }

  failed(req, res, message, err.data || null, err.status || 500);
  next();
};

module.exports = {
  failed,
  handler404,
  handler5xx,
  success,
};
