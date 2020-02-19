import React, { useEffect, useContext, useMemo } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { StateActionType } from '../../types';
import _isEqual from 'lodash/isEqual';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import _once from 'lodash/once';
import parseText from '../../parser/text-parser';

interface TagProps {
  name: string;
  body: string;
  params: string | string[];
}
export const TagFunctionShared: TagComponent<TagProps> = React.memo((props) => {
  const context = useContext(LayoutStateContext);
  const params = useMemo(() => {
    if (typeof props.params === 'string') {
      return props.params.split(',');
    }
    return props.params ?? [];
  }, [props.params]);

  useEffect(() => {
    const funcStr = `function(${params.join(',')}) {
      ${props.body}
    }`;

    context.dispatch({
      type: StateActionType.SetGlobal,
      payload: {
        name: props.name,
        value: parseText(`{{${funcStr}}}`),
      },
    });
  }, [props.name, params]);

  return null;
});
TagFunctionShared.displayName = 'TagFunctionShared';
