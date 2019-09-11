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
    pushRelease: false, // 仅在production环境使用该变量
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
