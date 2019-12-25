import { Middleware } from 'redux';
import _cloneDeep from 'lodash/cloneDeep';

export type ActionsListItem = Readonly<[string, object]>;
export type ActionsListType = ActionsListItem[];

const _actions: ActionsListType = [];
const MAX_SIZE = 500; // 最大记录500条

/**
 * 一个将记录存储在内存中的日志
 * 用于调试
 */
export const memoryLogger: Middleware = ({ dispatch, getState }) => (next) => (
  action
) => {
  const a = _cloneDeep(action);
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
