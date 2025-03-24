const testMiddleware = (req, res, next) => {
  // Add test context to request
  req.testContext = {
    startTime: Date.now(),
    testId: Math.random().toString(36).substring(7),
    environment: 'test'
  };

  // Modify response methods to track test data
  const originalJson = res.json;
  res.json = function(data) {
    if (data) {
      // Add test metadata to responses
      data._testMetadata = {
        testId: req.testContext.testId,
        processingTime: Date.now() - req.testContext.startTime,
        environment: 'test',
        timestamp: new Date().toISOString()
      };
    }
    return originalJson.call(this, data);
  };

  next();
};

module.exports = testMiddleware;

