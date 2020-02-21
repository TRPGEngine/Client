import React, { useEffect, useContext } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { StateActionType } from '../../types';
import _isEqual from 'lodash/isEqual';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import _once from 'lodash/once';
import _head from 'lodash/head';
import { evalScript } from '../../processor';
import { generateSandboxContext } from '../../processor/sandbox';
import { getChildrenText } from '../utils';

export const TagScriptShared: TagComponent = React.memo((props) => {
  const context = useContext(LayoutStateContext);

  useEffect(() => {
    // 永远只执行一次
    const body = getChildrenText(props._el);

    const sandbox = generateSandboxContext(context);
    evalScript(`(function(){${body}})()`, {
      ...sandbox,
      setData(name: string, value: any) {
        context.dispatch({
          type: StateActionType.UpdateData,
          payload: {
            name,
            value,
          },
        });
      },
      setGlobal(name: string, value: any) {
        context.dispatch({
          type: StateActionType.SetGlobal,
          payload: {
            name,
            value,
          },
        });
      },
    });
  }, []);

  return null;
});
TagScriptShared.displayName = 'TagScriptShared';
