const baseConfig = require('../../jest.config');

module.exports = Object.assign({}, baseConfig, {
  preset: 'react-native',
  // transformIgnorePatterns: [],
  // transform: {
  //   '^.+\\.tsx?$': 'ts-jest',
  //   '^.+\\.jsx?$': 'babel-jest',
  // },
});
