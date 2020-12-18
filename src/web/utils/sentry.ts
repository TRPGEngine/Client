import type { CaptureContext } from '@sentry/types';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import Config from 'config';
import _get from 'lodash/get';
import _once from 'lodash/once';
import _isNil from 'lodash/isNil';
import config from '@shared/project.config';
import { UserInfo } from '@redux/types/user';
import { getJWTUserInfo } from '@shared/utils/jwt-helper';

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
    dsn: getDSN(),
    release:
      environment === 'production' ? _get(Config, 'sentry.release') : undefined,
    environment,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.2,
    denyUrls: ['chrome-extension://'],
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered',
      `Can't find variable: Notification`,
      `'Notification' is undefined`,
    ],
  });
});

/**
 * 汇报错误
 * @param err 错误
 */
export async function error(err: Error | string) {
  initSentry(); // 确保Sentry被初始化

  let fn;
  if (typeof err === 'string') {
    fn = Sentry.captureMessage.bind(Sentry);
  } else {
    fn = Sentry.captureException.bind(Sentry);
  }
  const context: CaptureContext = {
    contexts: {
      token: {
        ...(await getJWTUserInfo()),
      },
    },
  };
  const sentryId = fn(err, context);
  console.warn('error: sentryId', sentryId);
}

/**
 * 设置用户信息操作
 */
export function setUser(userInfo: UserInfo) {
  Sentry.setUser({
    id: userInfo.uuid,
    username: `${userInfo.nickname}(${userInfo.username})`,
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

/**
 * 使用sentry包裹组件
 */
export function wrapSentry(Component: React.ComponentType) {
  initSentry(); // 确保Sentry被初始化

  return Sentry.withProfiler(Component);
}
