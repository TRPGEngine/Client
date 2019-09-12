const paths = require('./build/metro/babel-paths');

module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['NODE_ENV', 'PLATFORM', 'TRPG_HOST'],
      },
    ],
    ['import', { libraryName: '@ant-design/react-native' }],
    ['module-resolver', paths],
  ],
};
