/**
 * 专门用于人物卡portal的webpack配置
 */

process.env.TRPG_APP_NAME = 'Portal';

const webpackMerge = require('webpack-merge');
const path = require('path');
const url = require('url');
const base = require('./webpack.config.js');
const OfflinePlugin = require('offline-plugin');

const ROOT_PATH = path.resolve(__dirname, '../../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist/portal');
const ASSET_PATH = process.env.ASSET_PATH || '/';
const publicPath = url.resolve(ASSET_PATH, '/portal/');

const dllConfig = require('./dll/vendor-manifest.json');
const dllHashName = 'dll_' + dllConfig.name;

const isProduction = process.env.NODE_ENV === 'production';

const config = webpackMerge({}, base, {
  entry: {
    app: path.resolve(APP_PATH, './portal/index.tsx'),
  },

  output: {
    path: DIST_PATH,
    publicPath,
  },

  devtool: isProduction ? false : 'cheap-module-eval-source-map',

  devServer: {
    host: '0.0.0.0',
    port: 8190,
    compress: true,
    overlay: true,
    historyApiFallback: {
      rewrites: [
        { from: `${dllHashName}.js`, to: `/portal/${dllHashName}.js` },
        { from: /.*/, to: `${ASSET_PATH}index.html` },
      ],
    },
    hot: true,
    inline: true,
  },
});

/**
 * portal不需要offline插件
 */
config.plugins = config.plugins.filter((x) => !(x instanceof OfflinePlugin));

module.exports = config;
