import type { UserInfo } from '@redux/types/user';
import { getUserName } from '@shared/utils/data-helper';
import posthog from 'posthog-js';
import _isString from 'lodash/isString';
import _get from 'lodash/get';
import Config from 'config';
import config from '@shared/project.config';

// Posthog
const token = _get(Config, 'posthog.token');
const instance = _get(Config, 'posthog.instance');

/**
 * 初始化统计分析系统
 */
export function initAnalytics() {
  if (_isString(token) && _isString(instance)) {
    posthog.init(token, {
      api_host: instance,
      autocapture: false, // 关闭autocapture以节约事件用量
      disable_session_recording: true, // 关闭自动录屏(不需要且一直报错)
    });
    posthog.register({
      environment: config.environment,
      version: config.version,
      platform: config.platform,
    });
  }
}

/**
 * 设置分析的用户信息
 * @param info 用户信息
 */
export function setAnalyticsUser(info: UserInfo) {
  posthog.identify(info.uuid, {
    name: getUserName(info),
    username: info.username,
  });
}

/**
 * 发送事件
 * @param name 事件名
 * @param properties 相关属性
 */
export function trackEvent(name: string, properties?: posthog.Properties) {
  posthog.capture(name, properties);
}

/**
 * 发送单页应用Url变更事件
 */
export function trackUrlChangeEvent() {
  posthog.capture('$pageview');
}
