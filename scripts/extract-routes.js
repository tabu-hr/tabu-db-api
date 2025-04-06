const fs = require('fs');
const path = require('path');

// Define paths
const ROOT_DIR = path.resolve(__dirname, '..');
const DEV_ROUTES_DIR = path.join(ROOT_DIR, 'src', 'routes', 'environments', 'development');
const PROD_ROUTES_DIR = path.join(ROOT_DIR, 'src', 'routes', 'environments', 'production');

// Production route template
const ROUTE_TEMPLATE = `
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { validationResult } = require('express-validator');
const createError = require('http-errors');

// Configure security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply middleware
router.use(helmet());
router.use(limiter);

// Validation middleware
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(400, {
      message: 'Validation Error',
      errors: errors.array()
    }));
  }
  next();
}

// Production routes
{{ROUTES}}

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Route error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      details: err.errors || null
    }
  });
});

module.exports = router;
`.trim();

function extractRoutes(content) {
  const lines = content.split('\n');
  const routes = [];
  let currentRoute = [];
  let isInRoute = false;
  let bracketCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for route start
    if (line.includes('router.post')) {
      console.log(`Found route at line ${i + 1}:`, line.trim());
      isInRoute = true;
      currentRoute = [line];
      bracketCount = (line.match(/{/g) || []).length;
      bracketCount -= (line.match(/}/g) || []).length;
      continue;
    }

    if (isInRoute) {
      currentRoute.push(line);
      bracketCount += (line.match(/{/g) || []).length;
      bracketCount -= (line.match(/}/g) || []).length;

      if (bracketCount === 0 && line.includes('});')) {
        routes.push(currentRoute.join('\n'));
        console.log('Route extraction complete');
        isInRoute = false;
        currentRoute = [];
      }
    }
  }

  return routes;
}

function processFile(filename) {
  try {
    const filePath = path.join(DEV_ROUTES_DIR, filename);
    console.log(`\nProcessing ${filename}...`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const routes = extractRoutes(content);
    
    if (routes.length === 0) {
      console.log(`No POST routes found in ${filename}`);
      return;
    }

    console.log(`Found ${routes.length} POST route(s)`);
    
    const prodFilePath = path.join(PROD_ROUTES_DIR, filename);
    const routeContent = ROUTE_TEMPLATE.replace('{{ROUTES}}', routes.join('\n\n'));
    
    fs.writeFileSync(prodFilePath, routeContent);
    console.log(`Generated production route file: ${prodFilePath}`);
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
}

// Main execution
console.log('Starting production routes generation...');

// Ensure directories exist
if (!fs.existsSync(PROD_ROUTES_DIR)) {
  fs.mkdirSync(PROD_ROUTES_DIR, { recursive: true });
}

if (!fs.existsSync(DEV_ROUTES_DIR)) {
  console.error(`Development directory not found: ${DEV_ROUTES_DIR}`);
  process.exit(1);
}

try {
  const files = fs.readdirSync(DEV_ROUTES_DIR)
    .filter(file => file.endsWith('.js'));

  if (files.length === 0) {
    console.error('No JavaScript files found in development directory');
    process.exit(1);
  }

  files.forEach(processFile);
  console.log('\nProduction routes generation completed successfully!');
} catch (error) {
  console.error('Failed to process route files:', error);
  process.exit(1);
}

