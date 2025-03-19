const redis = require('../config/redis');
const { DatabaseError } = require('../errors/customErrors');

// Check if Redis is available
const isRedisAvailable = async () => {
  try {
    if (!redis.isConnected || !redis.isReady) {
      return false;
    }
    
    // Perform a basic health check
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};

const DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

const cacheMiddleware = (keyPrefix, expiration = DEFAULT_EXPIRATION) => {
  return async (req, res, next) => {
    // Skip caching in test environment if Redis is not available
    if (process.env.NODE_ENV === 'test') {
      try {
        const redisAvailable = await isRedisAvailable();
        if (!redisAvailable) {
          return next();
        }
      } catch (error) {
        console.warn('Redis availability check failed, skipping cache:', error.message);
        return next();
      }
    }

    const cacheKey = `${keyPrefix}:${req.originalUrl.replace(/\//g, ':')}`;

    try {
      // Check Redis connection before operations
      const redisAvailable = await isRedisAvailable();
      if (!redisAvailable) {
        console.warn('Redis not available, skipping cache retrieval');
        return next();
      }

      // Add timeout for Redis get operation
      const cachedData = await Promise.race([
        redis.get(cacheKey),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis get operation timed out')), 1000)
        )
      ]);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Store original res.json function before any operations
      const originalJson = res.json;

      // Override res.json to cache the response
      res.json = function(data) {
  // Store response before any potential Redis errors
  const result = originalJson.call(this, data);

  // Check Redis connection before storing
  isRedisAvailable()
    .then(available => {
      if (!available) {
        console.warn('Redis not available, skipping cache storage');
        return;
      }
      
      console.log(`Caching data for key: ${cacheKey}`);
      // Add timeout for Redis setex operation
      return Promise.race([
        redis.setex(cacheKey, expiration, JSON.stringify(data)),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis setex operation timed out')), 1000)
        )
      ]);
    })
    .then(result => {
      if (result) console.log(`Cached data for key: ${cacheKey}`);
    })
    .catch(err => {
      console.error('Cache storage error:', err);
      // Don't throw errors during caching - just log them
    });

  return result;
};

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      // Don't fail the request if caching fails, just log and continue
      if (error.message.includes('timed out') || 
          error.message.includes('connection') ||
          error.message.includes('ECONNREFUSED')) {
        console.warn('Redis connection issue, continuing without cache');
        return next();
      }
      next(error);
    }
  };
};

const clearCache = async (pattern) => {
  try {
    // Check Redis connection before operations
    const redisAvailable = await isRedisAvailable();
    if (!redisAvailable) {
      console.warn('Redis not available, skipping cache clear');
      return;
    }
    
    // Add timeout for Redis keys operation
    const keys = await Promise.race([
      redis.keys(`tabu:${pattern}`),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis keys operation timed out')), 2000)
      )
    ]);
    if (keys.length > 0) {
      // Add timeout for Redis del operation
      await Promise.race([
        redis.del(keys),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis del operation timed out')), 2000)
        )
      ]);
    }
  } catch (error) {
    throw new DatabaseError('Failed to clear cache', error);
  }
};

module.exports = {
  cacheMiddleware,
  clearCache
};
