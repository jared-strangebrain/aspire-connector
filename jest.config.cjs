/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  // Look for compiled files:
  roots: ['<rootDir>/dist'],
  testMatch: ['**/handler.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  // We already compiled to JS, so no transforms:
  transform: {},
  // Optional: show more detail if needed
  // verbose: true
};
