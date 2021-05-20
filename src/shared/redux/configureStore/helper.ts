/**
 * Store帮助类, 用于直接从Store中获取一些状态信息
 */

import _isNil from 'lodash/isNil';
import type { TRPGReducer, TRPGState, TRPGStore } from '@redux/types/__all__';
import { combineReducers } from '@reduxjs/toolkit';

let _store: TRPGStore;
let _allReducers: Record<string, TRPGReducer> = {};

export function initStoreHelper(
  store: TRPGStore,
  reducers: Record<string, TRPGReducer>
): void {
  _store = store;
  _allReducers = reducers;
}

export function getStoreState(): TRPGState | null {
  if (_isNil(_store)) {
    return null;
  }

  return _store.getState();
}

export function getCurrentStore(): TRPGStore | undefined {
  return _store;
}

const makeAllReducer = (asyncReducers: Record<string, TRPGReducer>) =>
  combineReducers({
    ...asyncReducers,
  });

/**
 * 注入 Reducer 用于动态加载
 */
export function injectReducer(key: string, reducer: TRPGReducer) {
  if (Object.hasOwnProperty.call(_allReducers, key)) {
    return;
  }

  _allReducers[key] = reducer;
  _store.replaceReducer(makeAllReducer(_allReducers) as any);
}

export function setAllReducer(reducers: Record<string, TRPGReducer>) {
  _allReducers = {
    ..._allReducers,
    ...reducers,
  };
}
