import { Middleware } from 'redux';
import _cloneDeepWith from 'lodash/cloneDeepWith';
import React from 'react';
import { TRPGMiddleware } from '@redux/types/__all__';

export type ActionsListItem = Readonly<[string, object]>;
export type ActionsListType = ActionsListItem[];

const _actions: ActionsListType = [];
const MAX_SIZE = 500; // 最大记录500条

/**
 * 深度拷贝的方法
 * 返回undefined则继续迭代
 */
function loggerCloneFn(val: any) {
  if (React.isValidElement(val)) {
    // 不记录React组件。因为深度拷贝的话内容会过大
    return '[ReactElement]';
  }
}

/**
 * 一个将记录存储在内存中的日志
 * 用于调试
 */
export const memoryLogger: TRPGMiddleware = ({ dispatch, getState }) => (
  next
) => (action) => {
  const a = _cloneDeepWith(action, loggerCloneFn);
  _actions.push([a.type, a]);

  if (_actions.length > MAX_SIZE) {
    _actions.shift(); // 弹出第一个，扔掉
  }

  next(action);
};

/**
 * 返回一个浅拷贝的action记录
 */
export const getLogger = (): ActionsListType => {
  return [..._actions];
};
