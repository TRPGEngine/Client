import React, { useMemo } from 'react';
import { TagComponent } from '../type';
import _isArray from 'lodash/isArray';
import { useToArray } from '@shared/hooks/useToArray';
import { UseDefineComponent } from '../Use/shared';

interface TagProps {
  name: string;
  data: object[];
  define: string;
}
export const TagForEachShared: TagComponent<TagProps> = React.memo((props) => {
  const data = useToArray(props.data);

  const items = useMemo(() => {
    return data.map((item, i) => {
      return (
        <UseDefineComponent
          {...item}
          name={`${props.name}-${i}`}
          define={props.define}
        />
      );
    });
  }, [data, props.name, props.define]);

  return items as any;
});
TagForEachShared.displayName = 'TagForEachShared';
