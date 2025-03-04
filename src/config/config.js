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
* @typedef {Object} AppConfig
* @property {ServerConfig} server - Server-related configuration
* @property {DatabaseConfig} database - Database-related configuration
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
}
};

// Freeze the configuration object to prevent modifications at runtime
Object.freeze(config);
Object.freeze(config.server);
Object.freeze(config.database);

module.exports = config;
