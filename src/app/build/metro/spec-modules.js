// 这里主要设置强制将某些模块指定到app的node-modules
const path = require('path');

const appSpecModules = ['react-native', 'styled-components'];

const extraNodeModules = {};

for (const name of appSpecModules) {
  extraNodeModules[name] = path.resolve(
    __dirname,
    `../../node_modules/${name}`
  );
}

module.exports = extraNodeModules;
