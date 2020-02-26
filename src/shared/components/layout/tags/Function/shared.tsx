import React, { useEffect, useContext, useMemo } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { StateActionType } from '../../types';
import { evalScript } from '../../processor';
import { generateSandboxContext } from '../../processor/sandbox';
import { TMemo } from '@shared/components/TMemo';

interface TagProps {
  name: string;
  body: string;
  params: string | string[];
}
export const TagFunctionShared: TagComponent<TagProps> = TMemo((props) => {
  const context = useContext(LayoutStateContext);
  const params = useMemo(() => {
    if (typeof props.params === 'string') {
      return props.params.split(',');
    }
    return props.params ?? [];
  }, [props.params]);

  useEffect(() => {
    const funcStr = `function (${params.join(',')}) {
      ${props.body}
    }`;

    const sandbox = generateSandboxContext(context);
    const func = evalScript(funcStr, sandbox);

    context.dispatch({
      type: StateActionType.SetGlobal,
      payload: {
        name: props.name,
        value: func,
      },
    });
  }, [props.name, params]);

  return null;
});
TagFunctionShared.displayName = 'TagFunctionShared';
