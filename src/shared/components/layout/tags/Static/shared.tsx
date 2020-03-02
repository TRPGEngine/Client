import React, { useContext, useRef } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { StateActionType } from '../../types';
import _isEqual from 'lodash/isEqual';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { parseDataText } from '../../processor';
import { TMemo } from '@shared/components/TMemo';

interface TagProps {
  name: string;
  value: any;
}
export const TagStaticShared: TagComponent<TagProps> = TMemo((props) => {
  const context = useContext(LayoutStateContext);
  const isRunRef = useRef(false);

  if (isRunRef.current === false) {
    isRunRef.current = true;

    if (_isString(props.value)) {
      // 需要处理数据
      try {
        const realVal = parseDataText(`{{(${props.value})}}`, context);

        context.dispatch({
          type: StateActionType.SetGlobal,
          payload: {
            name: props.name,
            value: realVal,
          },
        });
      } catch (e) {
        // 不处理解析错误的变量
        console.warn('Cannot parse attr:', props.name, props.value, e);
      }

      return;
    }
  }

  return null;
});
TagStaticShared.displayName = 'TagStaticShared';
