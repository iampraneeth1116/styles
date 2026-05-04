export default {
  transform: {},
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports', outputName: 'server-test-report.xml' }]
  ]
};
