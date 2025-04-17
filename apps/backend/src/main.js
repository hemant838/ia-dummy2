require('dotenv').config();

const express = require('express');
const responseTime = require('response-time');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const appConfig = require('./configs/app.config');
const helpers = require('./helpers');
const middlewares = require('./middlewares');

const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(compression());

const ALLOWED_ORIGINS = appConfig.allowedOrigin;
const corsOrigin =
  Array.isArray(ALLOWED_ORIGINS) && ALLOWED_ORIGINS.length
    ? ALLOWED_ORIGINS
    : '*';

const corsOptions = {
  origin: corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  // allowedHeaders: ['x-requested-with', 'Content-Type', 'Authorization', 'Accept'] // Adjust as necessary
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false, limit: '512mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(
  responseTime((req, res, time) => {
    res.setHeader('X-Response-Time', `${time}ms`);
  }),
);
app.use(express.text());

app.set('trust proxy', true);

app.use(middlewares.addRequestId);

app.use('/', routes);

app.use(helpers.response.handler404);
app.use(helpers.response.handler5xx);

// Catch unhandled exception.
process.on('uncaughtException', function (err) {
  console.log(err);
  console.error(
    `Unhandled exception orderId=${err.orderId}`,
    err,
    err.requestId || 'unhandled',
    true,
  );
});

app.listen(appConfig.port, () => {
  console.log(
    `App running in ${appConfig.env} at http://localhost:${appConfig.port}`,
  );
});
