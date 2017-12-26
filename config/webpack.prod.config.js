const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const base = require('./webpack.base.config.js');

module.exports = webpackMerge({}, base, {
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
  //     }
  //   }),
  // ]
})
