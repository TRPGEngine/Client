const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '../');
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');
const CONFIG_PATH = path.resolve(ROOT_PATH, 'config');

module.exports = {
  entry: path.resolve(APP_PATH, './web/index.js'),
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
        include: [
          APP_PATH,
          CONFIG_PATH,
          path.resolve(ROOT_PATH, './node_modules/trpg-actor-template/'),
          path.resolve(ROOT_PATH, './node_modules/react-native-storage/'),
        ],
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|svg|eot|ttf)$/,
        loader: 'url-loader?limit=8192&name=assets/[hash].[ext]'
      }
    ]
  },

  externals: {
    electron: "require('electron')",
    "react-native": "require('react-native')",
    "./nav": "require('./nav')",
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'PLATFORM': JSON.stringify(process.env.PLATFORM),
        'TRPG_HOST': JSON.stringify(process.env.TRPG_HOST),
      }
    }),
    new HtmlwebpackPlugin({
      title: 'TRPG-Game',
      template: path.resolve(BUILD_PATH, './template/index.html'),
      inject: true,
      favicon: path.resolve(APP_PATH, './assets/img/favicon.ico')
    }),
  ],
}
