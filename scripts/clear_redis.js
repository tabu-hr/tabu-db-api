const redis = require('../src/config/redis');

async function clearRedis() {
  try {
    console.log('Clearing Redis...');
    await redis.flushall();
    console.log('Redis cleared successfully');
    
    // Close the Redis connection
    await redis.quit();
    console.log('Redis connection closed');
  } catch (error) {
    console.error('Error clearing Redis:', error);
    process.exit(1);
  }
}

clearRedis();