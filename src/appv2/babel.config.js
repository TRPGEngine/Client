const paths = require('./build/metro/babel-paths');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['module-resolver', paths]],
};
