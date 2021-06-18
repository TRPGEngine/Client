import React, { useMemo, Fragment } from 'react';
import type { TagComponent } from '../type';
import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
import _isFunction from 'lodash/isFunction';
import { useToArray } from '@shared/hooks/useToArray';
import { UseDefineComponent } from '../Use/shared';
import { TMemo } from '@shared/components/TMemo';
import shortid from 'shortid';
import { useToFunction } from '@shared/hooks/useToFunction';

/**
 * 用于循环渲染组件
 */
interface ForEachComponentProps {
  name?: string; // 此处的name是作为一个key的参考来使用的。如果不传则生成一个shortid用
  data: object[];
  define: string;
  getItemName?: (item: any) => string;
}
export const ForEachComponent: React.FC<ForEachComponentProps> = TMemo(
  (props) => {
    const name = useMemo(() => props.name ?? shortid.generate(), [props.name]);
    const data = useToArray(props.data);
    const getItemName = useToFunction(props.getItemName);

    const items = useMemo(() => {
      return data.map((item, i) => {
        if (!_isPlainObject(item)) {
          // 处理item为非PlainObject的情况， 如[1,2,3]
          item = { data: item };
        }

        const useName = _isFunction(getItemName)
          ? getItemName(item)
          : `${name}.${i}`;
        return (
          <UseDefineComponent
            {...item}
            key={`${name}.${i}`}
            index={i}
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
        getItemName={props.getItemName}
      />
    );
  }
);
TagForEachShared.displayName = 'TagForEachShared';
