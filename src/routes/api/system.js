const express = require('express');
const router = express.Router();
const errorHandler = require('../../middleware/errorHandler');
const CacheMonitor = require('../../middleware/cacheMonitor');

/**
 * @swagger
 * /api/system/cache-stats:
 *   get:
 *     summary: Get cache statistics
 *     description: Returns statistics about the cache system
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Cache statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     stats:
 *                       type: object
 *                       properties:
 *                         hits:
 *                           type: number
 *                         misses:
 *                           type: number
 *                         keys:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Current keys in cache
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/cache-stats', async (req, res, next) => {
  try {
    const stats = await CacheMonitor.getStats();
    res.json({
      success: true,
      response: {
        message: 'Cache statistics retrieved successfully',
        stats
      },
      action: 'getCacheStats',
      error: null
    });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;

