module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['NODE_ENV', 'PLATFORM', 'TRPG_HOST'],
      },
    ],
    ['import', { libraryName: '@ant-design/react-native' }],
    [
      'module-resolver',
      {
        alias: {
          // 从src/app开始
          config: '../../build/metro/conf.json',
        },
      },
    ],
  ],
};
