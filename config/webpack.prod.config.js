const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const base = require('./webpack.base.config.js');

module.exports = webpackMerge({}, base, {
  mode: 'production',
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false,
  //       drop_debugger: true,
  //       drop_console: true,
  //     },
  //     sourceMap: false,
  //     mangle: {
  //       except: ['$super', '$', 'exports', 'require'], // 排除关键字
  //     },
  //   }),
  // ],
  plugins: [
    // Sentry
    new SentryCliPlugin({
      include: APP_PATH,
      ignoreFile: '.sentrycliignore',
      ignore: ['app'],
      configFile: 'sentry.properties',
      release: `v${config.version}-${process.env.NODE_ENV}`,
    }),
  ],
});
