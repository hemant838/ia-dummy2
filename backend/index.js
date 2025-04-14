const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(';').filter((origin) => origin)
  : [];
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
app.use(express.text());

app.set('trust proxy', true);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Ok!' });
});

const port = process.env.PORT || 5002;

app.listen(port, () => console.log(`Server started on port ${port}`));
