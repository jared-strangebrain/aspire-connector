export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/dist'],
  testMatch: ['**/handler.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {},
  testTimeout: 30000,
};

