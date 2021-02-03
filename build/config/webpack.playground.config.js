/**
 * 专门用于人物卡编辑器的webpack配置
 */

process.env.TRPG_APP_NAME = 'Playground';

const { merge } = require('webpack-merge');
const MonacoWebpackPlugin = require('../../src/playground/node_modules/monaco-editor-webpack-plugin');
const path = require('path');
const url = require('url');
const _ = require('lodash');
const base = require('./webpack.base.config.js');
const WorkboxPlugin = require('workbox-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '../../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist/playground');
const ASSET_PATH = process.env.ASSET_PATH || '/';
const publicPath = url.resolve(ASSET_PATH, '/playground/');

const dllConfig = require('./dll/vendor-manifest.json');
const dllHashName = 'dll_' + dllConfig.name;

const isProduction = process.env.NODE_ENV === 'production';

const config = merge({}, base, {
  entry: {
    app: path.resolve(APP_PATH, './playground/index.tsx'),
  },

  output: {
    path: DIST_PATH,
    publicPath,
  },

  // NOTICE: 会报错。不知道为什么。
  // devtool: isProduction ? false : 'cheap-module-eval-source-map',

  devServer: {
    host: '0.0.0.0',
    port: 8191,
    compress: true,
    overlay: true,
    publicPath: '/playground/',
    historyApiFallback: {
      rewrites: [
        { from: `${dllHashName}.js`, to: `/playground/${dllHashName}.js` },
        { from: /.*/, to: url.resolve(publicPath, 'index.html') },
      ],
    },
    hot: true,
    inline: true,
  },

  plugins: [
    new MonacoWebpackPlugin({
      languages: ['xml'],
    }),
  ],
});

// use npm run build:report or npm run playground:build --report
// to generate bundle-report
if (_.get(process, 'env.npm_config_report', false)) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: true,
    })
  );
}

/**
 * playground不需要offline插件
 */
config.plugins = config.plugins.filter(
  (x) => !(x instanceof WorkboxPlugin.GenerateSW)
);

module.exports = config;
