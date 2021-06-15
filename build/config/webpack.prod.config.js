const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base.config.js');
const package = require('../../package.json');
const config = require('config');

const ROOT_PATH = path.resolve(__dirname, '../../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');

const extraConfig = {};

const plugins = [
  // 设置最小文件大小
  // 过于小且密的文件反而会降低速度
  new webpack.optimize.MinChunkSizePlugin({
    minChunkSize: 10000,
  }),
];

const generateBuildReport = _.get(process, 'env.npm_config_report', false);
const pushReleaseToSentry = _.get(config, 'sentry.pushRelease', false) === true;

// use npm run build:report or npm run build:pro --report
// to generate bundle-report
if (generateBuildReport) {
  console.log('打包统计已启动...');
  if (pushReleaseToSentry) {
    console.log('请注意: 在该模式下不会发布 release map 到 sentry');
  }

  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: true,
    })
  );
} else if (pushReleaseToSentry) {
  // 仅在不使用report功能时生效
  // 增加推送到sentry插件
  const SentryCliPlugin = require('@sentry/webpack-plugin');
  extraConfig.devtool = 'hidden-source-map'; // 增加编译后输出sourcemap https://webpack.docschina.org/configuration/devtool/
  plugins.push(
    new SentryCliPlugin({
      include: DIST_PATH,
      ignoreFile: '.sentrycliignore',
      ignore: ['app'],
      configFile: 'sentry.properties',
      release: _.get(config, 'sentry.release'),
      urlPrefix: process.env.SENRTY_RELEASE_URL_PREFIX || '~/',
    })
  );
}

module.exports = merge({}, base, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },

  ...extraConfig,

  plugins: [...plugins],
});
