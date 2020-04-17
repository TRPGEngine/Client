import React, { useMemo } from 'react';
import { TagComponent } from '../type';
import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
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
      if (!_isPlainObject(item)) {
        // 处理item为非PlainObject的情况， 如[1,2,3]
        item = { data: item };
      }

      const useName = item.name ?? `${props.name}-${i}`;
      return (
        <UseDefineComponent
          {...item}
          key={`${props.name}-${i}`}
          name={useName}
          define={props.define}
        />
      );
    });
  }, [data, props.name, props.define]);

  return items as any;
});
TagForEachShared.displayName = 'TagForEachShared';
