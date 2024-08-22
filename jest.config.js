// jest.config.js
export default {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.js$': 'babel-jest', // Ensure you have babel-jest installed for ES modules
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results', // Directory for JUnit reports
      outputName: 'junit.xml'           // Name of the JUnit report file
    }]
  ]
};