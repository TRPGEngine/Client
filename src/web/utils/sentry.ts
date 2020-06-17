import * as Sentry from '@sentry/browser';
import Config from 'config';
import _get from 'lodash/get';
import config from '@shared/project.config';

const environment = config.environment;

Sentry.init({
  release:
    environment === 'production' ? _get(Config, 'sentry.release') : undefined,
  environment,
  dsn: _get(Config, 'sentry.dsn'),
});

/**
 * 汇报错误
 * @param err 错误
 */
export function error(err: Error | string) {
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
 * 打开报告面板
 */
export function showReportDialog() {
  Sentry.showReportDialog();
}
