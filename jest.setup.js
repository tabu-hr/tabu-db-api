// jest.setup.js
require('dotenv').config({ path: '.env.test' });
jest.setTimeout(30000);

// Suppress deprecation warnings
process.on('warning', (warning) => {console.log(warning);
  if (warning.name === 'DeprecationWarning') {
    // Handle or suppress the warning
  }
});
