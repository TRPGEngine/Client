// 为了处理 react-native android 无法直接引用package.json的问题
const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const package = require('../../package.json');

const { version, appVersion } = package;

// 获取当前git hash
const gitHash = execa.commandSync('git rev-parse HEAD').stdout;

fs.writeJsonSync(path.resolve(__dirname, '../../version.json'), {
  version,
  appVersion,
  gitHash,
});
console.log('创建版本信息成功!');
