import React, { useMemo, Fragment } from 'react';
import type { TagComponent } from '../type';
import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
import { useToArray } from '@shared/hooks/useToArray';
import { UseDefineComponent } from '../Use/shared';
import { TMemo } from '@shared/components/TMemo';
import shortid from 'shortid';

/**
 * 用于循环渲染组件
 */
interface ForEachComponentProps {
  name?: string; // 此处的name是作为一个key的参考来使用的。如果不传则生成一个shortid用
  data: object[];
  define: string;
}
export const ForEachComponent: React.FC<ForEachComponentProps> = TMemo(
  (props) => {
    const name = useMemo(() => props.name ?? shortid.generate(), [props.name]);
    const data = useToArray(props.data);

    const items = useMemo(() => {
      return data.map((item, i) => {
        if (!_isPlainObject(item)) {
          // 处理item为非PlainObject的情况， 如[1,2,3]
          item = { data: item };
        }

        const useName = `${name}.${i}`;
        return (
          <UseDefineComponent
            {...item}
            key={`${name}.${i}`}
            name={useName}
            define={props.define}
          />
        );
      });
    }, [data, name, props.define]);

    return <Fragment>{items}</Fragment>;
  }
);
ForEachComponent.displayName = 'ForEachComponent';

export const TagForEachShared: TagComponent<ForEachComponentProps> = TMemo(
  (props) => {
    return (
      <ForEachComponent
        name={props.name}
        data={props.data}
        define={props.define}
      />
    );
  }
);
TagForEachShared.displayName = 'TagForEachShared';
