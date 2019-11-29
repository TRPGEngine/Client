/**
 * 专门用于人物卡编辑器的webpack配置
 */

process.env.TRPG_APP_NAME = 'Portal';

const webpackMerge = require('webpack-merge');
const path = require('path');
const base = require('./webpack.config.js');
const WebpackBar = require('webpackbar');

const ROOT_PATH = path.resolve(__dirname, '../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist/portal');
const ASSET_PATH = '/portal/';

module.exports = webpackMerge({}, base, {
  entry: {
    app: path.resolve(APP_PATH, './portal/index.tsx'),
  },

  output: {
    path: DIST_PATH,
    publicPath: ASSET_PATH,
  },

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    host: '0.0.0.0',
    port: 8190,
    compress: true,
    historyApiFallback: true,
    hot: true,
    inline: true,
  },
});
