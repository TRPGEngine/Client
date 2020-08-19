/**
 * NOTE: 对于app来说。需要重新编译二进制版本后JS文件才能取到配置
 * 因此，增加新的配置（如果该配置在JS中用到）需要发布二进制文件
 */

const appName = process.env.TRPG_APP_NAME || 'Game';
const environment = process.env.NODE_ENV;
const package = require('../package.json');

module.exports = {
  release: {
    // 生产环境必填
    store: {
      file: '',
      password: '',
    },
    key: {
      alias: '',
      password: '',
    },
  },
  codepush: {
    url: 'http://codepush.moonrailgun.com',
    deploymentKey: 'pafmXkZi2xoKkj7UkNrGijKJJu2c4ksvOXqog', // 正式环境
    deploymentKeyStaging: 'puSxJ4RphFExKxLQQLvpI27e8C8r4ksvOXqog', // 生产环境
  },
  sentry: {
    dsn: '',
    mobileDsn: '', //移动端的dsn
    feedbackUrl: '', // 见https://docs.sentry.io/api/projects/post-project-user-reports/
    pushRelease: false, // 仅在production环境使用该变量
    release: `${appName}-v${package.version}-${environment}`,
  },
  umeng: {
    push: {
      channel: 'TRPG',
      appkey: '',
      messageSecret: '',
    },
    mipush: {
      // 小米厂商推送通道配置
      appid: '',
      appkey: '',
    },
  },
};
