module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.[tj]s$': 'babel-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleFileExtensions: ['js', 'json', 'vue'],
  testEnvironmentOptions: {
    NODE_OPTIONS: '--no-warnings',
  },
};
