const baseConfig = require('../../jest.config');
const { defaults: tsjPreset } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../../tsconfig');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  transform: {
    ...tsjPreset.transform,
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
    '\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transformIgnorePatterns: [], // 包括node_modules里的东西也进行转换
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../../',
  }),
  setupFilesAfterEnv: [
    require.resolve('./test/setup.ts'), // 注册全局
  ],
  rootDir: '.',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
    window: {},
  },
  cacheDirectory: '.jest/cache',
};
