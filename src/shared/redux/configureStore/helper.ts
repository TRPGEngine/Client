/**
 * Store帮助类, 用于直接从Store中获取一些状态信息
 */

import { Store } from 'redux';
import _isNil from 'lodash/isNil';
import { TRPGState } from '@redux/types/__all__';

let _store: Store;
export function initStoreHelper(store: Store): void {
  _store = store;
}

export function getStoreState(): TRPGState | null {
  if (_isNil(_store)) {
    return null;
  }

  return _store.getState();
}
