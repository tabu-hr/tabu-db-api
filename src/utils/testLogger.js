const logTestRequest = (req) => {
  console.log(`[Test Request] ${new Date().toISOString()}`);
  console.log(`  Path: ${req.method} ${req.path}`);
  console.log(`  TestID: ${req.testContext.testId}`);
  console.log(`  Query:`, req.query);
  console.log(`  Body:`, req.body);
  console.log(`  Headers:`, req.headers);
};

module.exports = {
  logTestRequest
};

