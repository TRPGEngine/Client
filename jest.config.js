const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
const regeneratorRuntime = require('regenerator-runtime');

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  rootDir: '.',
  roots: ['<rootDir>/test/'],
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [
    require.resolve('./test/immutable-expect.ts'), // 注册预期
  ],
  globals: {
    window: {},
    regeneratorRuntime, // for react-native-storage
  },
  verbose: false,
};
