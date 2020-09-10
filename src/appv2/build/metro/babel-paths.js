const tsconfig = require('../../../../tsconfig.json');
const path = require('path');
const startDir = process.env.START_DIR || '../../';
const tspaths = tsconfig.compilerOptions.paths;

function stripWildword(str) {
  return str.replace(/\/\*$/, '');
}

function parseTsPaths(paths) {
  const ret = {};
  for (const alias in paths) {
    if (paths.hasOwnProperty(alias)) {
      const targets = paths[alias];
      const target = targets[0];
      ret[stripWildword(alias)] = startDir + stripWildword(target);
    }
  }
  return ret;
}

module.exports = {
  alias: {
    ...parseTsPaths(tspaths),
  },
};
