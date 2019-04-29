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
    blacklistRE: blacklist([/src\/web/]),
  },
  transformer: {
    babelTransformerPath: path.resolve(
      __dirname,
      './build/metro/babel-transformer'
    ),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  // projectRoot: path.resolve(__dirname, './src/app/'), // 新版改为通过参数传递。很奇怪
  // watchFolders: [path.resolve(__dirname, './')], // 改为使用REACT_NATIVE_APP_ROOT环境变量
};
