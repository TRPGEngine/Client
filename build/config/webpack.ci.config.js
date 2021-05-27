const { merge } = require('webpack-merge');
const prod = require('./webpack.prod.config.js');
const path = require('path');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

/**
 * 在CI环境下的打包配置
 * 用于各种各样的包性能检查
 */
const config = merge({}, prod, {
  stats: {
    context: path.resolve(__dirname, '../../src'), // optional, will improve readability of the paths
    assets: true,
    entrypoints: true,
    chunks: true,
    modules: true,
  },
});

/**
 * ci编译不需要这些插件
 */
config.plugins = config.plugins.filter(
  (x) =>
    !(x instanceof WorkboxPlugin.GenerateSW || x instanceof SentryCliPlugin)
);

module.exports = config;
