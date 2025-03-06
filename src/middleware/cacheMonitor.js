const redis = require('../config/redis');

class CacheMonitor {
  static async getStats() {
    try {
      const info = await redis.info();
      const keys = await redis.dbsize();
      
      return {
        totalKeys: keys,
        hitRate: this._parseHitRate(info),
        memoryUsage: this._parseMemoryUsage(info),
        uptime: this._parseUptime(info)
      };
    } catch (error) {
      console.error('Cache monitoring error:', error);
      return null;
    }
  }

  static _parseHitRate(info) {
    const hits = info.match(/keyspace_hits:(\d+)/)?.[1] || 0;
    const misses = info.match(/keyspace_misses:(\d+)/)?.[1] || 0;
    const total = parseInt(hits) + parseInt(misses);
    return total ? (parseInt(hits) / total * 100).toFixed(2) : 0;
  }

  static _parseMemoryUsage(info) {
    return info.match(/used_memory_human:([^\r\n]+)/)?.[1] || '0B';
  }

  static _parseUptime(info) {
    const seconds = info.match(/uptime_in_seconds:(\d+)/)?.[1] || 0;
    return Math.floor(seconds / 3600);
  }
}

module.exports = CacheMonitor;