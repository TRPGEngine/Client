const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
const regeneratorRuntime = require('regenerator-runtime');
const _cloneDeep = require('lodash/cloneDeep');

const run = _cloneDeep(regeneratorRuntime);

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
  rootDir: '.',
  roots: [
    '<rootDir>/src/web/test/',
    '<rootDir>/src/',
  ],
  testRegex: ".*\\.(test|spec)\\.tsx?$",
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/src/app/", "<rootDir>/src/appv2/"],
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/fileTransformer.js',
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [
    require.resolve('./test/global.ts'), // 注册全局
    require.resolve('./test/setup.ts'), // 注册一些配置
  ],
  globals: {
    window: {},
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  verbose: true,
};
