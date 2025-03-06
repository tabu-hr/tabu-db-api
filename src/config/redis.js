const Redis = require('ioredis');
const client = new Redis();

// Increase max listeners to prevent warning
client.setMaxListeners(20);

client.on('connect', () => {
  console.log('Successfully connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = client;
