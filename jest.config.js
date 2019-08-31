const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
const regeneratorRuntime = require('regenerator-runtime');
const _cloneDeep = require('lodash/cloneDeep');

const run = _cloneDeep(regeneratorRuntime);

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
    require.resolve('./test/global.ts'), // 注册全局
    require.resolve('./test/immutable-expect.ts'), // 注册预期
  ],
  globals: {
    window: {},
  },
  verbose: false,
};
