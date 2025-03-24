const express = require('express');
const router = express.Router();
const apiRoutes = require('../../api');

// Production environment specific middleware
router.use((req, res, next) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: {
                message: 'Method not allowed in production environment',
                allowed: ['POST']
            }
        });
    }
    next();
});

// Apply production security middleware
router.use(require('helmet')());
router.use(require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Mount API routes using configured API route path
router.use(config.server.apiRoute, apiRoutes);

// Production specific error handling
router.use((err, req, res, next) => {
    console.error('[PROD Error]', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            // Don't expose stack trace in production
            code: err.code || 'INTERNAL_SERVER_ERROR'
        }
    });
});

module.exports = router;

