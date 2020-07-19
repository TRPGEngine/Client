const tsconfig = require('./tsconfig.json');
const _ = require('lodash');
const path = require('path');

const pathMap = tsconfig.compilerOptions.paths;
const tspathMountMapping = _.mapValues(pathMap, (val, key) => {
  const target = val[0];
  const mountedPath = path.relative('./src', target);

  return mountedPath.replace(`${path.sep}*`, '').replace(`${path.sep}`, '/');
});

const scriptsPathsMapping = _.fromPairs(
  _.toPairs(tspathMountMapping)
    .map(([key, val]) => {
      if (/^[a-zA-Z]/.test(val)) {
        return [
          `mount:tspath:${key}`,
          `mount ${key.replace(`/*`, '')} --to /_dist_/${val}`,
        ];
      }
    })
    .filter(_.isArray)
);

module.exports = {
  extends: '@snowpack/app-scripts-react',
  exclude: [
    '**/node_modules/**/*',
    '**/__tests__/*',
    '**/*.@(spec|test).@(js|mjs)',
    '**/src/app/**/*',
    '**/src/portal/**/*',
  ],
  scripts: {
    ...scriptsPathsMapping,
    'mount:@src': 'mount @src --to /_dist_',
    'mount:src': 'mount src --to /_dist_',
  },
  plugins: [],
  devOptions: {
    open: 'none',
    port: 8089,
  },
};
