// jest.setup.js
require('dotenv').config({ path: '.env.test' });
const events = require('events');
const { BigQuery } = require('@google-cloud/bigquery');
const redis = require('./src/config/redis');
const redisClient = redis;  // For backward compatibility

// Increase default timeout for tests
jest.setTimeout(60000); // Increased from 30000ms to 60000ms to accommodate slow Redis operations

// Increase max listeners for ResourceStream to prevent warnings
events.EventEmitter.defaultMaxListeners = 20;
// If there are specific ResourceStream objects that need higher limits, you can set them individually:
// someResourceStream.setMaxListeners(20);

// Improved warning handling
process.on('warning', (warning) => {
  // Skip MaxListenersExceededWarning as we've increased the limit
  if (warning.name === 'MaxListenersExceededWarning') {
    return;
  }
  
  // Handle deprecation warnings
  if (warning.name === 'DeprecationWarning') {
    // Log to console only in verbose mode
    if (process.env.VERBOSE_TESTS === 'true') {
      console.warn(`Deprecation warning: ${warning.message}`);
    }
    return;
  }
  
  // Log other warnings
  console.warn(`Warning: ${warning.name} - ${warning.message}`);
});

// Global error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

// Track BigQuery and Redis clients for cleanup
const resources = {
  bigQueryConnections: new Set(),
  redisClients: new Set(),
  supertestServers: new Set(),
};

// Register BigQuery connections for cleanup
global.registerBigQueryConnection = (connection) => {
  resources.bigQueryConnections.add(connection);
};

// Register Redis clients for cleanup
global.registerRedisClient = (client) => {
  resources.redisClients.add(client);
};

// Register supertest servers for cleanup
global.registerSupertestServer = (server) => {
  resources.supertestServers.add(server);
};
// Global teardown after all tests complete
afterAll(async () => {
  // Close BigQuery connections
  for (const connection of resources.bigQueryConnections) {
    try {
      if (connection && typeof connection.close === 'function') {
        await connection.close();
      }
    } catch (error) {
      console.error('Error closing BigQuery connection:', error);
    }
  }
  
  // Use our improved closeAllClients method for Redis
  try {
    await redis.closeAllClients();
  } catch (error) {
    console.error('Error closing Redis clients:', error);
  }
  
  // Close any individually registered Redis clients for backward compatibility
  for (const client of resources.redisClients) {
    try {
      if (client && client.quit && typeof client.quit === 'function' && client.status !== 'end') {
        await new Promise(resolve => {
          client.quit(() => {
            resolve();
          });
        });
      }
    } catch (error) {
      console.error('Error closing Redis client:', error);
    }
  }
  
  // Close any supertest servers
  for (const server of resources.supertestServers) {
    try {
      if (server && server.close && typeof server.close === 'function') {
        await new Promise((resolve) => {
          server.close(() => {
            resolve();
          });
        });
      }
    } catch (error) {
      console.error('Error closing supertest server:', error);
    }
  }

  // Clear the sets
  resources.bigQueryConnections.clear();
  resources.redisClients.clear();
  resources.supertestServers.clear();
  
  // Add a small delay to ensure all connections are properly closed
  await new Promise(resolve => setTimeout(resolve, 500)); // Increased delay from 100ms to 500ms
});

// Monkey patch BigQuery to track connections
const originalBigQueryConstructor = BigQuery;
global.BigQuery = function(...args) {
  const instance = new originalBigQueryConstructor(...args);
  global.registerBigQueryConnection(instance);
  return instance;
};
Object.assign(global.BigQuery, originalBigQueryConstructor);
global.BigQuery.prototype = originalBigQueryConstructor.prototype;

// Register the Redis client for tracking
global.registerRedisClient(redisClient);

// Make redis client available globally if needed
global.redisClient = redisClient;
