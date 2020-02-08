/**
 * 专门用于人物卡编辑器的webpack配置
 */

const webpackMerge = require('webpack-merge');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const base = require('./webpack.base.config.js');

const ROOT_PATH = path.resolve(__dirname, '../../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist/playground');
const ASSET_PATH = '/playground/';

const dllConfig = require('./dll/vendor-manifest.json');
const dllHashName = 'dll_' + dllConfig.name;

const isProduction = process.env.NODE_ENV === 'production';

module.exports = webpackMerge({}, base, {
  entry: {
    app: path.resolve(APP_PATH, './playground/index.tsx'),
  },

  output: {
    path: DIST_PATH,
    publicPath: ASSET_PATH,
  },

  // NOTICE: 会报错。不知道为什么。
  // devtool: isProduction ? false : 'cheap-module-eval-source-map',

  devServer: {
    host: '0.0.0.0',
    port: 8191,
    compress: true,
    overlay: true,
    historyApiFallback: {
      rewrites: [
        { from: `${dllHashName}.js`, to: `/playground/${dllHashName}.js` },
        { from: /.*/, to: `${ASSET_PATH}index.html` },
      ],
    },
    hot: true,
    inline: true,
  },

  plugins: [new MonacoWebpackPlugin()],
});
