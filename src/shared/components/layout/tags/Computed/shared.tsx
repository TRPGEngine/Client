/**
 * 该组件用于计算data的值并将data的值填到data中
 * 注意不要自己依赖自己
 */

import React, { useContext, useEffect, useMemo } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { parseDataText } from '../../processor';
import { useLayoutFieldState } from '../../hooks/useLayoutFieldState';

interface TagProps {
  deps: string | string[];
  expression: string;
  target: string;
}
export const TagComputedShared: TagComponent<TagProps> = React.memo((props) => {
  const context = useContext(LayoutStateContext);
  const [_, setStateValue] = useLayoutFieldState(props.target);

  const deps = useMemo(() => {
    if (typeof props.deps === 'string') {
      return props.deps.split(',');
    }

    return props.deps;
  }, [props.deps]);

  const watchValues = deps.map((name) => context.state.data[name]);
  useEffect(() => {
    if (deps.includes(props.target)) {
      console.warn('circle deps:', deps, props.target);
      return;
    }

    const value = parseDataText(`{{(${props.expression})}}`, context);

    setStateValue(value || null);
  }, [...watchValues, props.target, props.expression]);

  return null;
});
TagComputedShared.displayName = 'TagComputedShared';
