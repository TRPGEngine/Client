const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname, '../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');
// const CONFIG_PATH = path.resolve(ROOT_PATH, 'config');
const config = require('../package.json');

let vendors = Object.keys(config.dependencies);
if(process.env.PLATFORM !== 'app') {
  let arrRemove = function (arr, item) {
    let index = arr.indexOf(item);
    if(index >= 0) {
      arr.splice(index, 1);
    }
  }

  arrRemove(vendors, 'apsl-react-native-button');
  arrRemove(vendors, 'react-native');
  arrRemove(vendors, 'react-native-photo-browser');
  arrRemove(vendors, 'react-native-root-toast');
  arrRemove(vendors, 'react-native-storage');
  arrRemove(vendors, 'react-native-style-block');
  arrRemove(vendors, 'react-navigation');
}

console.log('vendor list:', vendors);

module.exports = {
  entry: {
    vendor: vendors,
    app: path.resolve(APP_PATH, './web/index.js')
  },
  output: {
    path: DIST_PATH,
    filename: '[name].[chunkhash:8].js'
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
        loader: 'babel-loader',
        // include: [
        //   APP_PATH,
        //   CONFIG_PATH,
        //   path.resolve(ROOT_PATH, './node_modules/trpg-actor-template/'),
        //   path.resolve(ROOT_PATH, './node_modules/react-native-storage/'),
        // ],
        query: {
          presets: ['es2015', 'react', 'stage-3'],
          plugins: [
            ['transform-runtime', {
              helpers: false,
              polyfill: false,
              regenerator: true }],
          ]
        }
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|svg|eot|ttf)$/,
        loader: 'url-loader?limit=8192&name=assets/[hash].[ext]'
      },
    ]
  },

  externals: {
    electron: 'require(\'electron\')',
    'react-native': 'require(\'react-native\')',
    './nav': 'require(\'./nav\')',
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: Infinity,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'PLATFORM': JSON.stringify(process.env.PLATFORM),
        'TRPG_HOST': JSON.stringify(process.env.TRPG_HOST),
      }
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(BUILD_PATH, './template/pre-loading.css'), to: 'pre-loading.css' },
    ]),
    new HtmlwebpackPlugin({
      title: 'TRPG-Game',
      template: path.resolve(BUILD_PATH, './template/index.html'),
      inject: true,
      favicon: path.resolve(APP_PATH, './assets/img/favicon.ico'),
      hash: true
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [ 'pre-loading.css' ],
      append: false
    }),
  ],
}
