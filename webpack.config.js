const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
  entry: path.resolve(APP_PATH, 'index.js'),
  output: {
    path: DIST_PATH,
    filename: 'bundle.js'
  },
  //babel重要的loader在这里
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(js|jsx)?$/,
        loader: "babel-loader",
        include: APP_PATH,
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|svg|eot|ttf)$/,
        loader: 'url-loader?limit=8192&name=[hash].[ext]'
      }
    ]
  },

  devtool: 'cheap-module-eval-source-map', //开发环境

  devServer: {
    compress: true, // 启用Gzip压缩
    historyApiFallback: true, // 为404页启用多个路径
    hot: true, // 模块热更新，配置HotModuleReplacementPlugin
    https: false, // 适用于ssl安全证书网站
    noInfo: true, // 只在热加载错误和警告
    // ...
  },

  plugins: [
    new HtmlwebpackPlugin({
      title: 'TRPG-Game',
      template: 'build/template/index.html',
      inject: false,
    })
  ],
}
