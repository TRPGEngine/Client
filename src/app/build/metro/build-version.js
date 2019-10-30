// 为了处理 react-native android 无法直接引用package.json的问题
const fs = require('fs-extra');
const path = require('path');
const package = require('../../package.json');

const { version, appVersion } = package;

fs.writeJsonSync(path.resolve(__dirname, '../../version.json'), {
  version,
  appVersion,
});
console.log('创建版本信息成功!');
