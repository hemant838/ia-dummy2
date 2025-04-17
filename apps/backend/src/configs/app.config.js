const packageJson = require('../../package.json');
const version = packageJson.version;
const env = process.env.NODE_ENV || 'production';
const port = process.env.PORT;
const allowedOrigin = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(';').filter((origin) => origin)
  : [];

module.exports = {
  version,
  env,
  port,
  allowedOrigin,
};
