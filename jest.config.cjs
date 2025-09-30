/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/dist"],
  testMatch: ["**/handler.test.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {} // no transforms; we run compiled JS from dist
};
