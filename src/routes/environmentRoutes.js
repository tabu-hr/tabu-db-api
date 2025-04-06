const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');
const { queryBigQuery } = require('../models/bigQuery');
const response = require('../dto/tables');
const { DatabaseError } = require('../errors/customErrors');
const config = require('../config/config');

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
    router.use(`${config.server.apiRoute}/:tableName`, async (req, res, next) => {
        const tableName = req.params.tableName;
        if (tableName) {
            try {
                // Extract pagination parameters from query string
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const offset = (page - 1) * limit;

                // Query the table with pagination
                const result = await queryBigQuery(tableName, limit, offset);
                res.json(response(true, tableName, result.data, result.pagination));
            } catch (error) {
                next(new DatabaseError(`Error querying BigQuery table ${tableName}`, error));
            }
        } else {
            next();
        }
    });
} catch (error) {
    logger.error(`Failed to load ${environment} environment routes:`, error);
}

module.exports = router;
