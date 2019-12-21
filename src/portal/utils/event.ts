import _isUndefined from 'lodash/isUndefined';
import _pull from 'lodash/pull';
import { PortalEventTypes } from '@shared/types/portal';

type EventFn = (...args: any[]) => void;

interface Events {
  [name: string]: EventFn[];
}

const _events: Events = {};

/**
 * 增加事件监听
 */
export const on = (eventName: string, fn: EventFn) => {
  if (_isUndefined(_events[eventName])) {
    _events[eventName] = [];
  }

  _events[eventName].push(fn);
};

/**
 * 移除事件监听
 */
export const off = (eventName: string, fn: EventFn) => {
  if (Array.isArray(_events[eventName])) {
    _pull(_events[eventName], fn);
  }
};

/**
 * 发送全局事件
 */
export const emit = (eventName: string, ...args: any[]) => {
  if (!_isUndefined(_events[eventName]) && Array.isArray(_events[eventName])) {
    _events[eventName].forEach((fn) => fn(...args));
  }
};

/**
 * 构建要使用PostMessage发送的数据
 * @param type 事件类型
 * @param others 其他参数
 */
export const buildPostPayload = (
  type: PortalEventTypes,
  others?: {}
): string => {
  return JSON.stringify({
    ...others,
    type,
  });
};
export const postMessage = (type: PortalEventTypes, others?: {}) => {
  window.postMessage(buildPostPayload(type, others), '*');
};

window.emit = emit;
