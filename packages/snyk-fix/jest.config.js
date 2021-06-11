module.exports = {
  preset: 'ts-jest',
  transform: {}, // ignore .babelrc file
  collectCoverage: false, // not collecting coverage for now
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['text-summary', 'html'],
};
