import React, { useEffect, useContext, useMemo } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { StateActionType } from '../../types';
import _isEqual from 'lodash/isEqual';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { parseDataText } from '../../processor';
import { is } from '@shared/utils/string-helper';
import { TMemo } from '@shared/components/TMemo';

interface TagProps {
  name: string;
  value: any;
  ':value': any;
  static: string;
}
export const TagVarShared: TagComponent<TagProps> = TMemo(
  (props) => {
    const context = useContext(LayoutStateContext);

    const watchDeps = useMemo(() => {
      if (is(props.static)) {
        return [];
      } else {
        return [context.state.data, props.name, props.value];
      }
    }, [props.static, context.state.data, props.name, props.value]);

    useEffect(() => {
      if (!_isNil(props[':value'])) {
        console.warn('Var组件 不支持:value的参数');
        return;
      }

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
    }, watchDeps);

    return null;
  },
  (prevProps, nextProps) => {
    if (prevProps.name !== nextProps.name) {
      return false;
    }

    return _isEqual(prevProps.value, prevProps.value);
  }
);
TagVarShared.displayName = 'TagVarShared';
