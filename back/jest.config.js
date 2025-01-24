/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@solana/web3.js/dist/types$': '@solana/web3.js',
    '^@crypto-dashboard-shared$': '<rootDir>/../shared/src/index.js',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!@oslojs)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  extensionsToTreatAsEsm: ['.ts'],
};
