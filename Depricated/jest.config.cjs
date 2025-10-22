/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/dist'],
  testMatch: ['**/handler.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {}, // run compiled JS in dist
  testTimeout: 30000, // <-- add this
};
