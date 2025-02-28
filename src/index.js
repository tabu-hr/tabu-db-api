const express = require('express');
const app = express();
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

const port = process.env.PORT || 3001;

const routes = require('./routes/api');
const { errorHandler } = require('./middleware');
const { NotFoundError } = require('./errors/customErrors');
const apiRoute = process.env.API_ROUTE || '/api';

// Middleware to log request URL and parameters with date and time if LOG_REQUESTS is true
app.use((req, res, next) => {
  if (process.env.LOG_REQUESTS === 'true') {
    const currentDate = new Date().toISOString();
    console.log(`[${currentDate}] Request URL: ${req.url}`);
    console.log(`[${currentDate}] Request Parameters: ${JSON.stringify(req.params)}`);
  }
  next();
});

app.use(cors());
app.use(express.json());
app.use(apiRoute, routes);

// 404 handler for routes that don't exist
app.use((req, res, next) => {
next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Error handler middleware (should be last)
app.use(errorHandler);

app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});
