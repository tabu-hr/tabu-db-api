const Redis = require('ioredis');

// Track active Redis clients for cleanup
const activeClients = new Set();

/**
 * Creates and returns a configured Redis client
 * @param {Object} options - Custom Redis client options
 * @returns {Redis} - Configured Redis client
 */
function getRedisClient(options = {}) {
  // Default configuration
  const defaultConfig = {
    host: 'tabu-redis',
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    autoResendUnfulfilledCommands: true,
    retryStrategy: function(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError: function(err) {
      // Only reconnect on specific errors
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true; // Reconnect for READONLY errors
      }
      return false;
    },
  };

  // Test environment configuration
  if (process.env.NODE_ENV === 'test') {
    defaultConfig.enableOfflineQueue = true;
    defaultConfig.lazyConnect = true;
    defaultConfig.showFriendlyErrorStack = true;
    
    // Use a separate DB for tests to avoid conflicts
    defaultConfig.db = 1;
  }

  // Merge default config with custom options
  const config = { ...defaultConfig, ...options };
  
  // Create a new Redis client
  const client = new Redis(config);
  
  // Increase max listeners to prevent warning
  client.setMaxListeners(20);

  // Track connection state
  let isConnected = false;
  let isReady = false;

  // Register event listeners
  client.on('connect', () => {
    isConnected = true;
    console.log('Successfully connected to Redis');
  });

  client.on('ready', () => {
    isReady = true;
    console.log('Redis client is ready');
  });

  client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  client.on('close', () => {
    isConnected = false;
    isReady = false;
    console.log('Redis connection closed');
  });

  client.on('reconnecting', () => {
    console.log('Reconnecting to Redis...');
  });

  // Add methods to check connection state
  client.isConnected = () => isConnected;
  client.isReady = () => isReady;

  // Track this client for potential cleanup
  activeClients.add(client);

  // Override the quit method to remove the client from the tracking set
  const originalQuit = client.quit;
  client.quit = function(...args) {
    activeClients.delete(client);
    return originalQuit.apply(this, args);
  };

  return client;
}

/**
 * Close all active Redis clients
 * @returns {Promise<void>}
 */
async function closeAllClients() {
  const closePromises = [];
  
  for (const client of activeClients) {
    closePromises.push(
      new Promise(resolve => {
        try {
          if (client && client.quit && typeof client.quit === 'function') {
            client.quit(() => resolve());
          } else {
            resolve();
          }
        } catch (error) {
          console.error('Error closing Redis client:', error);
          resolve();
        }
      })
    );
  }
  
  await Promise.all(closePromises);
  activeClients.clear();
}

// Create a singleton instance for backward compatibility
const defaultClient = getRedisClient();

module.exports = defaultClient;
module.exports.getRedisClient = getRedisClient;
module.exports.closeAllClients = closeAllClients;
