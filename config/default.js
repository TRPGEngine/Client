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
  },
};
