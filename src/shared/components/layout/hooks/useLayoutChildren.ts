import React from 'react';
import { useMemo, ReactNode } from 'react';
import type { LayoutProps } from '../processor';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isEmpty from 'lodash/isEmpty';
import { LayoutNode } from '../processor/LayoutNode';

export const useLayoutChildren = (props: LayoutProps): ReactNode => {
  const children = useMemo(() => {
    if (_isEmpty(props._childrenEl)) {
      return null;
    }

    return props._childrenEl.map((el, index) => {
      // NOTICE: 所有的组件返回的实例都应当有key. 因为这个元素是map出来的
      return React.createElement(LayoutNode, {
        key: index,
        node: el,
      });
    });
  }, [props._childrenEl]);

  return children;
};
