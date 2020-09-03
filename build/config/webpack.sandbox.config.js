const webpackMerge = require('webpack-merge');
const dev = require('./webpack.dev.config.js');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');

module.exports = webpackMerge({}, dev, {
  entry: {
    app: path.resolve(APP_PATH, './sandbox/index.tsx'),
  },
});
