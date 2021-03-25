const { merge } = require('webpack-merge');
const base = require('./webpack.base.config.js');

const devSW = process.env.DEV_SW === 'true';

module.exports = merge({}, base, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', //开发环境
  // devtool: 'eval-source-map', //开发环境

  devServer: {
    compress: true, // 启用Gzip压缩
    historyApiFallback: true, // 为404页启用多个路径
    hot: true, // 模块热更新，配置HotModuleReplacementPlugin
    inline: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 8089, // 监听端口号
    https: devSW, // 适用于ssl安全证书网站
    noInfo: true, // 只在热加载错误和警告
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:23256/',
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
});
