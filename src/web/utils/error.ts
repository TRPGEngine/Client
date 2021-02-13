import _isString from 'lodash/isString';
import { notification } from 'antd';

/**
 * 通用的错误处理机制
 */
export function handleError(err: any, prefix: string = '') {
  if (_isString(err?.msg)) {
    notification.error({ message: prefix + err?.msg });
  } else {
    notification.error({ message: prefix + String(err) });
  }
}

/**
 * 汇报错误
 * 异步加载sentry
 * 以防止正常情况下sentry修改日志堆栈信息
 */
export function reportError(err: Error | string): void {
  import('./sentry').then((module) => module.error(err));
}
