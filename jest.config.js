const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    '^@users/(.*)$': '<rootDir>/users/$1',
    '^@entities/(.*)$': '<rootDir>/entities/$1',
    '^@auth/(.*)$': '<rootDir>/auth/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@database/(.*)$': '<rootDir>/database/$1',
    '^@entities/(.*)$': '<rootDir>/entities/$1',
    '^@middleware/(.*)$': '<rootDir>/middleware/$1',
    '^@audit/(.*)$': '<rootDir>/audit/$1',
    '^@users/(.*)$': '<rootDir>/users/$1',
    '^@task/(.*)$': '<rootDir>/task/$1',
  },
};
