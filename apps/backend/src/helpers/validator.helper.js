const exceptions = require('../exceptions');

const validateRequestBody = (schemaName, reqBody, httpCode = 400) => {
  try {
    //
  } catch (error) {
    throw new exceptions.ValidationErrors(error, null, httpCode);
  }
};

module.exports = validateRequestBody;
