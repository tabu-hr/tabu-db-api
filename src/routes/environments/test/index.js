const express = require('express');
const router = express.Router();
const apiRoutes = require('../../api');
const swaggerRoutes = require('../development/swagger');

// Test environment specific middleware
router.use((req, res, next) => {
    console.log(`[TEST] ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Mount Swagger documentation routes
router.use('/swagger', swaggerRoutes.router);

// Mount API routes using configured API route path
router.use(config.server.apiRoute, apiRoutes);

// Test specific error handling
router.use((err, req, res, next) => {
    console.error('[TEST Error]', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            stack: err.stack,
            details: err
        }
    });
});

module.exports = router;

