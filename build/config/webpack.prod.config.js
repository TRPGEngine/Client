const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const package = require('../../package.json');
const config = require('config');
const OfflinePlugin = require('offline-plugin');

const ROOT_PATH = path.resolve(__dirname, '../../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');

const plugins = [];

// use npm run build:report or npm run build:pro --report
// to generate bundle-report
if (_.get(process, 'env.npm_config_report', false)) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: true,
    })
  );
} else if (_.get(config, 'sentry.pushRelease', false) === true) {
  // 仅在不使用report功能时生效
  // 增加推送到sentry插件
  const SentryCliPlugin = require('@sentry/webpack-plugin');
  plugins.push(
    new SentryCliPlugin({
      include: APP_PATH,
      ignoreFile: '.sentrycliignore',
      ignore: ['app'],
      configFile: 'sentry.properties',
      release: `v${package.version}-${process.env.NODE_ENV}`,
    })
  );
}

module.exports = webpackMerge({}, base, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  plugins: [...plugins, new OfflinePlugin()],
});
