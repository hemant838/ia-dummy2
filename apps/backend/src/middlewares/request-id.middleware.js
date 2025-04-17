const appConfig = require('../configs/app.config');
const constant = require('../constant');

let nanoid;

(async () => {
  nanoid = (await import('nanoid')).nanoid;
})();

const addRequestId = (req, res, next) => {
  req.requestTime = process.hrtime();
  req.requestId = nanoid();
  let protocol = 'https';
  if (appConfig.env === constant.ENV.LOCAL) protocol = 'http';
  req.fullURL = `${protocol}://${req.get('host')}${req.originalUrl}`;
  next();
};

module.exports = addRequestId;
