/**
 * 专门用于人物卡编辑器的webpack配置
 */

const webpackMerge = require('webpack-merge');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const base = require('./webpack.base.config.js');

const ROOT_PATH = path.resolve(__dirname, '../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');

module.exports = webpackMerge({}, base, {
  entry: {
    app: path.resolve(APP_PATH, './actor-editor/index.tsx'),
  },
  plugins: [new MonacoWebpackPlugin()],
});
