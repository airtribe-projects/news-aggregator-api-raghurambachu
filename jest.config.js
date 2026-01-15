module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  // Match test files ending in .test.ts
  testMatch: ['**/__tests__/**/*.test.ts'], 
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',       // Exclude tests from coverage
    '!src/**/*.d.ts',          // Exclude type definition files
    '!src/config/db.ts',       // Exclude DB connection setup
  ],
  // Output coverage reports to the 'coverage' folder
  coverageDirectory: 'coverage', 
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
};