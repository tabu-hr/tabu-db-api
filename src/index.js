const express = require('express');
const cors = require('cors');
require('dotenv').config();

const config = require('./config/config');
const logger = require('./config/logger');
const environmentRouter = require('./routes/environmentRoutes');
const { errorHandler } = require('./middleware');
const { NotFoundError } = require('./errors/customErrors');

const app = express();
const environment = process.env.NODE_ENV || 'development';
// Request logging middleware
if (process.env.LOG_REQUESTS === 'true') {
    app.use((req, res, next) => {
        const currentDate = new Date().toISOString();
        logger.info(`[${currentDate}] Request URL: ${req.url}`);
        logger.debug(`[${currentDate}] Request Parameters:`, req.params);
        next();
    });
}

// Basic middleware
app.use(cors());
app.use(express.json());

// Development-specific middleware
if (environment === 'development') {
    app.use((req, res, next) => {
        logger.debug('Request Body:', req.body);
        next();
    });
}

// Load environment-specific routes
try {
    logger.info(`Loading routes for ${environment} environment...`);
    
    if (environment === 'development') {
        logger.info('Development mode: Enabling detailed route logging');
        environmentRouter.stack?.forEach(route => {
            if (route.route) {
                logger.info(`Route: ${route.route.path}`);
                Object.keys(route.route.methods).forEach(method => {
                    logger.info(`Method: ${method.toUpperCase()}`);
                });
            }
        });
    }
    
    app.use(environmentRouter);
    logger.info('✓ Environment-specific routes loaded successfully');
} catch (error) {
    logger.error('Failed to load environment-specific routes:', error);
    process.exit(1);
}

// 404 handler
app.use((req, res, next) => {
    next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Error handler middleware (should be last)
app.use(errorHandler);

// Start the server
config.getAvailablePort()
    .then(port => {
        config.freezeConfig();
        
        app.listen(port, config.server.host,() => {
            logger.info(`Server is running on http://${config.server.host}:${port}`);
            logger.info(`Environment: ${environment}`);
            logger.info(`API Route: ${config.server.apiRoute}`);
            logger.info(`Configuration port: ${config.server.port}`);
        });
    })
    .catch(err => {
        logger.error('Failed to start server:', err);
        process.exit(1);
    });

module.exports = app;
