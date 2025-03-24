const express = require('express');
const router = express.Router();
const os = require('os');

// Basic logging middleware specific to health endpoint
const logHealthCheck = (req, res, next) => {
    console.log(`[Health Check] ${new Date().toISOString()} - IP: ${req.ip}`);
    next();
};

router.get('/', logHealthCheck, (req, res) => {
    const healthInfo = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        system: {
            uptime: Math.floor(process.uptime()),
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem()
            },
            cpu: os.cpus().length,
            platform: os.platform(),
            hostname: os.hostname()
        },
        process: {
            pid: process.pid,
            version: process.version,
            memoryUsage: process.memoryUsage()
        }
    };

    console.log(`[Health Check] Response sent with status: ${healthInfo.status}`);
    res.status(200).json(healthInfo);
});

module.exports = router;

