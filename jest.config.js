/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  watchman: false,
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true
    }]
  },
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts'
  ],
  collectCoverageFrom: [
    'utils/**/*.ts',
    'services/**/*.ts',
    'graphql/resolvers/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  testTimeout: 30000,
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};