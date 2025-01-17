/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@solana/web3.js/dist/types$': '@solana/web3.js',
    '^crypto-dashboard-shared$': '<rootDir>/../shared/src',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@oslojs)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
};
