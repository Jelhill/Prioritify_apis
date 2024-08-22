// jest.config.js
export default {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results', 
      outputName: 'junit.xml' 
    }]
  ]
};