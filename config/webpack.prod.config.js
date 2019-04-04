const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const base = require('./webpack.base.config.js');
const package = require('../package.json');
const sentryConfig = require('config').get('sentry');

const ROOT_PATH = path.resolve(__dirname, '../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');

const plugins = [];
if (sentryConfig.pushRelease === true) {
  // 增加推送插件
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
  plugins,
});
