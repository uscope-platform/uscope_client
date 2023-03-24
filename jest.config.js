/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

const config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ['./test/client_core/jest.setup.js'],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }

};

module.exports = config;
