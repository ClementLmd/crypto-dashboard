/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@solana/web3.js/dist/types$': '@solana/web3.js',
    '^shared$': '<rootDir>/../shared/dist/index.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!@oslojs)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/.vercel/'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/../'],
  roots: ['<rootDir>/api'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
};
