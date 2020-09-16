import * as Sentry from '@sentry/browser';
import Config from 'config';
import _get from 'lodash/get';
import _once from 'lodash/once';
import _isNil from 'lodash/isNil';
import config from '@shared/project.config';
import { UserInfo } from '@redux/types/user';

const environment = config.environment;

export function getDSN(): string {
  return _get(Config, 'sentry.dsn');
}

/**
 * 初始化Sentry
 * 并确保只能初始化一次
 */
const initSentry = _once(() => {
  Sentry.init({
    release:
      environment === 'production' ? _get(Config, 'sentry.release') : undefined,
    environment,
    dsn: getDSN(),
  });
});

/**
 * 汇报错误
 * @param err 错误
 */
export function error(err: Error | string) {
  initSentry(); // 确保Sentry被初始化

  let fn;
  if (typeof err === 'string') {
    fn = Sentry.captureMessage.bind(Sentry);
  } else {
    fn = Sentry.captureException.bind(Sentry);
  }
  const sentryId = fn(err);
  console.warn('error: sentryId', sentryId);
}

/**
 * 设置用户信息操作
 */
export function setUser(userInfo: UserInfo) {
  Sentry.setUser({
    id: userInfo.uuid,
    username: userInfo.username,
  });
}

/**
 * 打开报告面板
 */
export function showReportDialog() {
  Sentry.showReportDialog();
}

/**
 * 获取api路径
 */
export function getFeedbackUrl(): string | null {
  const feedbackUrl = _get(Config, 'sentry.feedbackUrl');
  if (_isNil(feedbackUrl) || feedbackUrl === '') {
    return null;
  }

  return feedbackUrl;
}

export function getLastEventId(): string | undefined {
  return Sentry.lastEventId();
}
