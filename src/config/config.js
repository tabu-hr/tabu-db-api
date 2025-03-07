/**
* @fileoverview Centralized configuration module
*
* This module consolidates all environment variables used throughout the application
* into a single configuration object. This prevents duplication, ensures consistency,
* and makes it easier to manage configuration changes.
*/

// Load environment variables if not already loaded by the main application
if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
}

/**
* @typedef {Object} ServerConfig
* @property {number} port - The port the server will listen on
* @property {string} apiRoute - The base route for API endpoints
* @property {boolean} logRequests - Whether to log incoming requests
*/

/**
* @typedef {Object} DatabaseConfig
* @property {string} credentialsPath - Path to Google application credentials
* @property {string} schema - Database schema name
*/

/**
* @typedef {Object} RateLimitingConfig
* @property {number} windowMs - Window duration in milliseconds
* @property {number} max - Maximum number of requests per window
* @property {string} message - Message to display when rate limit is exceeded
*/

/**
* @typedef {Object} PaginationConfig
* @property {number} limit - Default number of items per page
* @property {number} offset - Default offset for pagination
*/

/**
* @typedef {Object} AppConfig
* @property {ServerConfig} server - Server-related configuration
* @property {DatabaseConfig} database - Database-related configuration
* @property {RateLimitingConfig} rateLimiting - Rate limiting configuration
* @property {Object} cache - Cache configuration
* @property {PaginationConfig} pagination - Pagination configuration
*/

/**
* Application configuration object containing all environment variables
* @type {AppConfig}
*/
const config = {
/**
* Server configuration settings
*/
server: {
    /**
    * Port the server will listen on
    * @default 3001
    */
    port: parseInt(process.env.PORT || '3001', 10),

    /**
    * Base route for API endpoints
    * @default '/api'
    */
    apiRoute: process.env.API_ROUTE || '/api',

    /**
    * Flag to enable/disable request logging
    * @default false
    */
    logRequests: process.env.LOG_REQUESTS === 'true',

    /**
    * Test unique ID for validation tests
    * @default 'ZH0AUT4KSN'
    */
    testUniqueId: process.env.TEST_UNIQUE_ID || 'ZH0AUT4KSN',

    /**
    * Test email for validation tests
    * @default 'info@nimesin.com'
    */
    testEmail: process.env.TEST_EMAIL || 'info@nimesin.com'
},

/**
* Database configuration settings
*/
database: {
    /**
    * Path to Google application credentials
    * Required for BigQuery authentication
    */
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,

    /**
    * Database schema name
    * @default 'app_demo'
    */
    schema: process.env.DB_SCHEMA || 'app_demo'
},

/**
* Rate limiting configuration settings
*/
rateLimiting: {
    /**
    * Window duration in milliseconds
    * @default 15 minutes
    */
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),

    /**
    * Maximum number of requests per window
    * @default 100
    */
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

    /**
    * Message to display when rate limit is exceeded
    * @default 'Too many requests from this IP, please try again later.'
    */
    message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.'
},

// Add cache configuration
cache: {
    durations: {
        TABLES: 3600,        // 1 hour
        USER: 1800,          // 30 minutes
        SUBMISSION: 1800,    // 30 minutes
        SALARY: 1800         // 30 minutes
    }
},

/**
* Pagination configuration settings
*/
pagination: {
    /**
    * Default number of items per page
    * @default 10
    */
    limit: parseInt(process.env.PAGINATION_LIMIT || '10', 10),
    
    /**
    * Default offset for pagination
    * @default 0
    */
    offset: parseInt(process.env.PAGINATION_OFFSET || '0', 10)
},
};

// Freeze the configuration object to prevent modifications at runtime
Object.freeze(config.server);
Object.freeze(config.database);
Object.freeze(config.rateLimiting);
Object.freeze(config.cache.durations);
Object.freeze(config.cache);
Object.freeze(config.pagination);
Object.freeze(config);

module.exports = config;
