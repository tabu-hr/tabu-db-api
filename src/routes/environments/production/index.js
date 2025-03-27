const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('../../../config/config');
const logger = require('../../../config/logger');

const router = express.Router();

// Production environment specific middleware
router.use((req, res, next) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: {
                message: 'Method not allowed in production environment',
                allowed: ['POST']
            }
        });
    }
    next();
});

// Apply production security middleware
router.use(helmet());
router.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Dynamically load and mount API routes
const apiRoutesPath = path.join(__dirname, '../../../routes/api');
fs.readdirSync(apiRoutesPath).forEach(file => {
    // Skip non-js files and index.js
    if (!file.endsWith('.js') || file === 'index.js') {
        return;
    }

    try {
        // Convert filename to route path (e.g., user.js -> /user)
        const routePath = `/${file.replace('.js', '')}`;
        const fullPath = path.join(apiRoutesPath, file);
        
        // Import the route module
        const routeModule = require(fullPath);
        
        // Mount the route at the configured API path
        router.use(`${config.server.apiRoute}${routePath}`, routeModule);
        logger.info(`[PRODUCTION] Mounted API route: ${routePath} (POST only)`);
    } catch (err) {
        logger.error(`Error loading route file ${file}:`, err);
    }
});

// Production specific error handling
router.use((err, req, res, next) => {
    logger.error('[PROD Error]', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            code: err.code || 'INTERNAL_SERVER_ERROR'
        }
    });
});

module.exports = router;
