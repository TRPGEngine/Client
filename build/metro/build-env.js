const config = require('config');
const _ = require('lodash');
const path = require('path');
const envPath = path.resolve(__dirname, '../../.env');
const fs = require('fs-extra');

/**
 * 将一个嵌套n层的对象转换成深度为1的plain object
 * 输出的key为全大写，用_分割层级
 * 输出的val为字符串
 * 如: {SENTRY_DSN: 'xxxx', SENTRY_PUSHRELEASE: 'true'}
 *
 * 仅处理val为string number boolean的数据
 * @param {object} target 原始对象
 * @param {object} parentObj 输出对象, 在迭代中为父对象
 * @param {string} parentKeyPath 父路径
 */
const buildEnv = (target, parentObj = {}, parentKeyPath = '') => {
  _.forOwn(target, (val, key) => {
    key = parentKeyPath + key.toUpperCase(); // key 转化

    if (typeof val === 'object') {
      buildEnv(val, parentObj, key + '_');
    } else if (
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean'
    ) {
      parentObj[key] = String(val);
    }
  });

  return parentObj;
};

/**
 * 将对象转化为.env文件字符串
 * @param {object} obj 要转换的对象，必须为深度为1的plain object
 */
const toDotEnvString = (obj) => {
  return _(obj)
    .toPairs()
    .map(([key, value], index) => key + '=' + value)
    .join('\n');
};

/**
 * 在项目根目录生成.env文件
 * @param {object} addonConfig 附加配置，必须是一个深度为1的plain object
 */
function generateEnvFile(addonConfig) {
  const data = buildEnv(Object.assign({}, config, addonConfig));
  const str = toDotEnvString(data);
  console.log('Building .env File...');
  fs.writeFileSync(envPath, str, { encoding: 'utf-8' });
  console.log('Building .env File...Success!');
}

module.exports = generateEnvFile;
