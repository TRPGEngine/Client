/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 * https://facebook.github.io/metro/docs/en/configuration
 *
 * @format
 */
const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  resolver: {
    // blacklistRE: blacklist([/config\/webpack\.*/]),
    extraNodeModules: {
      // config: JSON.stringify(require('config')),
      // 'package.json': path.resolve(__dirname, './package.json'),
      // path: JSON.stringify(''),
    },
    blacklistRE: blacklist[/src\/web/],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  projectRoot: path.resolve(__dirname, './src/app/'),
  watchFolders: [
    path.resolve(__dirname, './config/'),
    path.resolve(__dirname, './node_modules/'),
    path.resolve(__dirname, './src/api/'),
    path.resolve(__dirname, './src/shared/'),
    path.resolve(__dirname, './src/redux/'),
    path.resolve(__dirname, './src/assets/'),
    path.resolve(__dirname, './'),
  ],
};
