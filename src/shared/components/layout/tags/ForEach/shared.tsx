import React, { useMemo } from 'react';
import { TagComponent } from '../type';
import _isArray from 'lodash/isArray';
import { useToArray } from '@shared/hooks/useToArray';
import { UseDefineComponent } from '../Use/shared';
import { TMemo } from '@shared/components/TMemo';

interface TagProps {
  name: string;
  data: object[];
  define: string;
}
export const TagForEachShared: TagComponent<TagProps> = TMemo((props) => {
  const data = useToArray(props.data);

  const items = useMemo(() => {
    return data.map((item, i) => {
      return (
        <UseDefineComponent
          {...item}
          key={`${props.name}-${i}`}
          name={`${props.name}-${i}`}
          define={props.define}
        />
      );
    });
  }, [data, props.name, props.define]);

  return items as any;
});
TagForEachShared.displayName = 'TagForEachShared';
