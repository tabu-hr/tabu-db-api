const express = require('express');
const app = express();
const environmentRoutes = require('./environmentRoutes');

// Mount the routes
app.use('/', environmentRoutes);

// Helper function to print routes
function printRoutes(stack, basePath = '') {
    stack.forEach(middleware => {
        if (middleware.route) {
            const methods = Object.keys(middleware.route.methods)
                .map(method => method.toUpperCase())
                .join(',');
            console.log(`${methods}\t${basePath}${middleware.route.path}`);
        } else if (middleware.name === 'router') {
            const path = middleware.regexp.toString()
                .replace('/^\\', '')
                .replace('\\/?(?=\\/|$)/i', '')
                .replace(/\\/g, '');
            console.log(`\nRouter: ${basePath}${path}`);
            printRoutes(middleware.handle.stack, `${basePath}${path}`);
        }
    });
}

console.log('\nCurrent Environment:', process.env.NODE_ENV || 'development');
console.log('\nRegistered Routes:');
console.log('=====================================');
printRoutes(app._router.stack);

