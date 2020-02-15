import React, { useEffect, useContext } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { StateActionType } from '../../types';

interface TagProps {
  name: string;
  value: any;
}
export const TagVarShared: TagComponent<TagProps> = React.memo((props) => {
  const context = useContext(LayoutStateContext);
  useEffect(() => {
    context.dispatch({
      type: StateActionType.AddGlobal,
      payload: {
        name: props.name,
        value: props.value,
      },
    });
  }, []);

  return null;
});
TagVarShared.displayName = 'TagVarShared';
