import _isString from 'lodash/isString';
import { notification } from 'antd';

/**
 * 通用的错误处理机制
 */
export function handleError(err: any) {
  if (_isString(err?.msg)) {
    notification.error({ message: err?.msg });
  } else {
    notification.error({ message: String(err) });
  }
}
