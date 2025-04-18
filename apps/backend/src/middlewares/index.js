const addRequestId = require('./request-id.middleware');
const auth = require('./auth.middleware');
// const whitelist     = require('./whitelist-ip.middleware');

module.exports = {
  addRequestId,
  auth,
  //   whitelist
};
