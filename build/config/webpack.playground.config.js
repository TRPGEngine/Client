/**
 * 专门用于人物卡编辑器的webpack配置
 */

process.env.TRPG_APP_NAME = 'Playground';

const webpackMerge = require('webpack-merge');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const _ = require('lodash');
const base = require('./webpack.base.config.js');
const OfflinePlugin = require('offline-plugin');

const ROOT_PATH = path.resolve(__dirname, '../../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist/playground');
const ASSET_PATH = '/playground/';

const dllConfig = require('./dll/vendor-manifest.json');
const dllHashName = 'dll_' + dllConfig.name;

const isProduction = process.env.NODE_ENV === 'production';

const config = webpackMerge({}, base, {
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
config.plugins = config.plugins.filter((x) => !(x instanceof OfflinePlugin));

module.exports = config;
