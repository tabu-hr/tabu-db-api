const express = require('express');
const router = express.Router();
const redis = require('../config/redis');

router.get('/cache-stats', async (req, res, next) => {
  try {
    const info = await redis.info();
    const stats = {
      memory: {},
      stats: {},
      keyspace: {}
    };

    info.split('\n').forEach(line => {
      if (line.includes('used_memory_human')) {
        stats.memory.used = line.split(':')[1].trim();
      }
      if (line.includes('total_connections_received')) {
        stats.stats.connections = line.split(':')[1].trim();
      }
      if (line.includes('keyspace_hits')) {
        stats.stats.hits = line.split(':')[1].trim();
      }
      if (line.includes('keyspace_misses')) {
        stats.stats.misses = line.split(':')[1].trim();
      }
    });

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;