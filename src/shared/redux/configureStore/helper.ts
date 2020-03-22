/**
 * Store帮助类, 用于直接从Store中获取一些状态信息
 */

import _isNil from 'lodash/isNil';
import { TRPGState, TRPGStore } from '@redux/types/__all__';

let _store: TRPGStore;
export function initStoreHelper(store: TRPGStore): void {
  _store = store;
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
