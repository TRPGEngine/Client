/**
 * 专门用于人物卡portal的webpack配置
 */

process.env.TRPG_APP_NAME = 'Portal';
process.env.SENRTY_RELEASE_URL_PREFIX = '~/portal/';

const { merge } = require('webpack-merge');
const path = require('path');
const url = require('url');
const base = require('./webpack.config.js');
const WorkboxPlugin = require('workbox-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '../../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist/portal');
const ASSET_PATH = process.env.ASSET_PATH || '/';
const publicPath = url.resolve(ASSET_PATH, '/portal/');

const dllConfig = require('./dll/vendor-manifest.json');
const dllHashName = 'dll_' + dllConfig.name;

const isProduction = process.env.NODE_ENV === 'production';

const config = merge({}, base, {
  entry: {
    polyfill: '@babel/polyfill',
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
        { from: /.*/, to: url.resolve(publicPath, 'index.html') },
      ],
    },
    hot: true,
    inline: true,
  },
});

/**
 * portal不需要offline插件
 */
config.plugins = config.plugins.filter((x) => !(x instanceof WorkboxPlugin.GenerateSW));

module.exports = config;
