/**
 * 用于同一化编译时通过文件系统配置获取config
 */

module.exports = {
  // 手动指定部分配置以防止私密配置泄漏
  sentry: require('config').get('sentry'),
  posthog: require('config').get('posthog'),
};
