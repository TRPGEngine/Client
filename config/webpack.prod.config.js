const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const base = require('./webpack.base.config.js');
const package = require('../package.json');
const config = require('config');

const ROOT_PATH = path.resolve(__dirname, '../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');

const plugins = [];
if (_.get(config, 'sentry.pushRelease', false) === true) {
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
