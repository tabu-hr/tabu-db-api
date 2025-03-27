const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config');

/**
 * Gets all swagger definition files from the api directory
 * @returns {Object[]} Array of swagger definition objects
 */
const getSwaggerDefinitions = () => {
  const apiPath = path.join(__dirname, 'api');
  return fs.readdirSync(apiPath)
    .filter(file => file.endsWith('.swagger.js'))
    .map(file => require(path.join(apiPath, file)));
};

/**
 * Merges multiple swagger objects into a single object
 * @param {string} key - The key to merge (paths, schemas, parameters, responses)
 * @param {Object[]} definitions - Array of swagger definition objects
 * @returns {Object} Merged object
 */
const mergeSwaggerObjects = (key, definitions) => {
  return definitions.reduce((merged, def) => {
    if (key === 'schemas' || key === 'parameters' || key === 'responses') {
      return { ...merged, ...def[key] };
    }
    return { ...merged, ...def[key] };
  }, {});
};

// Get all swagger definitions from api directory
const swaggerDefinitions = getSwaggerDefinitions();

// Combine all paths and components
const paths = mergeSwaggerObjects('paths', swaggerDefinitions);
const schemas = mergeSwaggerObjects('schemas', swaggerDefinitions);
const parameters = mergeSwaggerObjects('parameters', swaggerDefinitions);
const responses = mergeSwaggerObjects('responses', swaggerDefinitions);

/**
 * Combined Swagger/OpenAPI specification
 * @type {Object}
 */
// SwaggerJSDoc options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tabu DB API',
      version: '1.0.0',
      description: 'API documentation for Tabu DB service'
    },
    servers: [
      {
        url: '',
        description: 'API Server'
      }
    ],
    paths,
    components: {
      schemas,
      parameters,
      responses,
    }
  },
  // Include both route files and swagger API files for JSDoc parsing
  apis: [
    path.join(__dirname, 'api/*.swagger.js')
  ]
};

// Generate swagger specification
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
