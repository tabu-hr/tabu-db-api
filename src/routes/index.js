const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

// Import the API routes
// Note: Route paths preserve underscores (e.g., /data_amount/check) to maintain exact route matching
const apiRoutes = fs.readdirSync(path.join(__dirname, 'api'))
    .filter(file => file.endsWith('.js'));

// Mount each API route
apiRoutes.forEach(file => {
    try {
        const routePath = `/${file.replace('.js', '')}`;
        const route = require(path.join(__dirname, 'api', file));
        
        if (typeof route === 'function' || route instanceof express.Router) {
            router.use(routePath, route);
            // Log the actual mounted route paths to verify underscore preservation
            const routeStack = route.stack || [];
            const endpoints = routeStack.map(layer => {
                const method = Object.keys(layer.route.methods)[0].toUpperCase();
                return `  ${method} ${routePath}${layer.route.path}`;
            });
            logger.info(`Mounted API route ${routePath} with endpoints:\n${endpoints.join('\n')}`);
        } else {
            logger.warn(`Skipping ${file}: not a valid middleware`);
        }
    } catch (error) {
        logger.error(`Error loading route file ${file}:`, error);
    }
});

// Mount system routes after API routes
if (fs.existsSync(path.join(__dirname, 'system.js'))) {
    const systemRoutes = require('./system');
    router.use('/system', systemRoutes);
    logger.info('Mounted system routes');
}

module.exports = router;
