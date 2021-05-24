import type { Middleware } from '@reduxjs/toolkit';
import { showToasts } from '@shared/manager/ui';
import _get from 'lodash/get';

/**
 * 监听notify事件的中间件
 */
export const watchNotify = (): Middleware => ({ dispatch, getState }) => (
  next
) => (action) => {
  if (action.type === 'ADD_NOTIFICATION') {
    const notification = _get(action.payload, 'notification', {});
    if (notification.type === 'error') {
      showToasts(notification.text, 'error');
    }
  }

  next(action);
};
