const path = require('path');
const webpack = require('webpack');

// 原则上是需要全量导入 且共用的模块 或特别大的模块
// 仅考虑网页端和portal需要使用的模块
const dllModules = [
  // 'react',
  // 'react-dom',
  'moment',
  'axios',
];

module.exports = {
  entry: {
    vendor: [...dllModules],
  },
  output: {
    filename: 'dll_[name].js',
    library: '[name]_[hash]',
    path: path.resolve(__dirname, './dll'),
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, './dll/[name]-manifest.json'),
      name: '[name]_[hash]',
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
  ],
  mode: 'production',
  devtool: 'hidden-source-map',
};
