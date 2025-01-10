/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@oslojs)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testPathIgnorePatterns: [
    '/node_modules/',
    'solana.unit.test.ts',
    'addresses.integration.test.ts',
  ],
};
