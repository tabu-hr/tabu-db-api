const redis = require('../config/redis');
const { DatabaseError } = require('../errors/customErrors');

const DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

const cacheMiddleware = (keyPrefix, expiration = DEFAULT_EXPIRATION) => {
  return async (req, res, next) => {
    const cacheKey = `${keyPrefix}:${req.originalUrl.replace(/\//g, ':')}`;

    try {
      const cachedData = await redis.get(cacheKey);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Store original res.json function
      const originalJson = res.json;

      // Override res.json to cache the response
res.json = function(data) {
  console.log(`Caching data: ${JSON.stringify(data)} for key: ${cacheKey}`);
  redis.setex(cacheKey, expiration, JSON.stringify(data))
    .then(() => console.log(`Cached data for key: ${cacheKey}`))
    .catch(err => console.error('Cache storage error:', err));

  return originalJson.call(this, data);
};

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next(error);
    }
  };
};

const clearCache = async (pattern) => {
  try {
    const keys = await redis.keys(`tabu:${pattern}`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    throw new DatabaseError('Failed to clear cache', error);
  }
};

module.exports = {
  cacheMiddleware,
  clearCache
};
