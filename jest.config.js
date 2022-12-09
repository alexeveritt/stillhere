module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/*.d.ts']
};
