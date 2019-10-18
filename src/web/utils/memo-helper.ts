import memoizeOne from 'memoize-one';
import { Collection, isImmutable } from 'immutable';
import { ReactNode } from 'react';
import _isNil from 'lodash/isNil';

/**
 * 用于优化使用Immutable存储的react node 元素
 * 防止toJS()导致的重绘
 */
export const memoImmutableNode = memoizeOne(
  (immutableReactNode: Collection<any, any>): ReactNode => {
    if (!_isNil(immutableReactNode) && isImmutable(immutableReactNode)) {
      return immutableReactNode.toJS();
    } else {
      return immutableReactNode;
    }
  }
);
