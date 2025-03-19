const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Load environment variables from .env file
require('dotenv').config();

const config = require('./config/config');
const routes = require('./routes/api');
const swaggerRoutes = require('./routes/swagger');
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

// Swagger documentation setup - only available in non-production environments
if (process.env.NODE_ENV !== 'production') {
  app.use('/swagger', swaggerRoutes);
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  console.log('Swagger UI enabled - available at /swagger');
}

// 404 handler for routes that don't exist
app.use((req, res, next) => {
next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Error handler middleware (should be last)
app.use(errorHandler);
app.use(errorHandler);

// Get an available port and start the server
config.getAvailablePort().then(port => {
  // Freeze the config now that we have determined the port
  config.freezeConfig();
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Configuration port: ${config.server.port}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
