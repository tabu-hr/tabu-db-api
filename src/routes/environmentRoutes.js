const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

const router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const routesPath = path.join(__dirname, 'environments', environment);

try {
    logger.info(`Loading routes for ${environment} environment`);
    
    // Check if the environment directory exists
    if (!fs.existsSync(routesPath)) {
        throw new Error(`No routes directory found for ${environment} environment`);
    }

    // Get all route files
    const routeFiles = fs.readdirSync(routesPath)
        .filter(file => file.endsWith('.js'));

    // Load each route file
    routeFiles.forEach(file => {
        try {
            const route = require(path.join(routesPath, file));
            const routeName = path.basename(file, '.js');

            if (route && typeof route === 'function') {
                router.use('/', route);
            } else if (route && route.router instanceof express.Router) {
                router.use('/', route.router);
            } else {
                logger.warn(`Skipping ${file}: Route export is neither a router nor a function`);
            }
        } catch (error) {
            logger.error(`Error loading route file ${file}: ${error.message}`);
        }
    });

    logger.info(`Finished loading ${routeFiles.length} routes for ${environment} environment`);

    // Add generic table route handler
    router.use('/:tableName', (req, res, next) => {
        const tableName = req.params.tableName;
        if (tableName) {
            // Forward to the appropriate table handler
            req.tableName = tableName;
            next();
        } else {
            next();
        }
    });
} catch (error) {
    logger.error(`Failed to load ${environment} environment routes:`, error);
}

module.exports = router;
