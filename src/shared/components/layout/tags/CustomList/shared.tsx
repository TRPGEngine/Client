import React from 'react';
import type { TagComponent } from '../type';
import { TMemo } from '@shared/components/TMemo';
import { useLayoutFieldState } from '../../hooks/useLayoutFieldState';
import { ForEachComponent } from '../ForEach/shared';

export interface TagCustomListSharedProps {
  name: string;
  define: string;
}
export const TagCustomListShared: TagComponent<TagCustomListSharedProps> = TMemo(
  (props) => {
    const [stateValue, _] = useLayoutFieldState(props.name);

    return (
      <ForEachComponent
        name={props.name}
        data={stateValue as any}
        define={props.define}
      />
    );
  }
);
TagCustomListShared.displayName = 'TagCustomListShared';
