const express = require('express');
const router = express.Router();
const apiRoutes = require('../../api');
const config = require('../../../config/config');
const logger = require('../../../config/logger');
const path = require('path');
const fs = require('fs');

let swaggerRouter;
try {
    swaggerRouter = require('./swagger');
} catch (err) {
    logger.warn('Swagger router not found:', err.message);
}
// Log route mounting for debugging
logger.info(`Mounting API routes at: ${config.server.apiRoute}`);

// Mount API routes using configured API route path
router.use(config.server.apiRoute, apiRoutes);

// Mount Swagger documentation if available
const swaggerConfigPath = path.join(__dirname, '../../../config/swagger/openapi.json');
if (swaggerRouter) {
    router.use('/swagger', swaggerRouter);
    router.get('/swagger/json', (req, res, next) => {
        try {
            if (fs.existsSync(swaggerConfigPath)) {
                const swaggerConfig = require(swaggerConfigPath);
                res.json(swaggerConfig);
            } else {
                const error = new Error('Swagger configuration not found');
                error.status = 404;
                throw error;
            }
        } catch (err) {
            logger.error('Error serving Swagger configuration:', err);
            next(err);
        }
    });
} else {
    router.use('/swagger', (req, res) => {
        res.status(404).json({
            message: 'Swagger documentation is not available in this environment'
        });
    });
}
// Error handling middleware specific to development environment
router.use((err, req, res, next) => {
    logger.error('Development environment error:', err);
    res.status(err.status || 500).json({
        message: err.message,
        stack: config.env === 'development' ? err.stack : undefined
    });
});

module.exports = router;
