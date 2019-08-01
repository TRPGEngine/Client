/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 * https://facebook.github.io/metro/docs/en/configuration
 *
 * @format
 */
const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');
const packageConfig = require('./package.json');
const NODE_ENV = process.env.NODE_ENV;

require('./build/metro/build-env')({
  version: packageConfig.version,
}); // 生成 .env 文件, 用于react-native-config

module.exports = {
  resolver: {
    blacklistRE: blacklist([/src\/web/]),
    sourceExts: ['js', 'ts', 'tsx'],
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
  // projectRoot: path.resolve(__dirname, './src/app/'),
  projectRoot: path.resolve(
    __dirname,
    NODE_ENV === 'production' ? './' : './src/app/'
  ),
  // watchFolders: [path.resolve(__dirname, './')], // 改为使用REACT_NATIVE_APP_ROOT环境变量
};
