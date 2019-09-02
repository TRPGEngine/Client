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
