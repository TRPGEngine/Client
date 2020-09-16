const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');
const extraNodeModules = require('./build/metro/spec-modules');

module.exports = {
  resolver: {
    blacklistRE: blacklist([/src\/web/]),
    extraNodeModules,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  projectRoot: path.resolve(__dirname, '../../src/appv2/'),
  watchFolders: [path.resolve(__dirname, '../../')],
};
