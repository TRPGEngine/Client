import React, { useMemo, useCallback } from 'react';
import { TagComponent } from '../type';
import { TMemo } from '@shared/components/TMemo';
import { Table } from 'antd';
import _head from 'lodash/head';
import _tail from 'lodash/tail';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { useToNumber } from '@shared/hooks/useToNumber';

interface TagProps {
  size?: SizeType;
  rows: string[][];
  height?: number;
  title?: string;
}
export const TagDataTableShared: TagComponent<TagProps> = TMemo((props) => {
  const rows = useMemo(() => {
    if (Array.isArray(props.rows)) {
      return props.rows;
    } else {
      return [];
    }
  }, [props.rows]);

  const columns = useMemo(() => {
    const head = _head(rows) ?? [];
    return head.map((d, i) => ({
      key: i,
      dataIndex: i,
      title: d,
    }));
  }, [rows]);

  const dataSource = useMemo(() => {
    const data = _tail(rows) ?? [];
    return data;
  }, [rows]);

  const height = useToNumber(props.height);
  const scroll = useMemo(() => {
    if (typeof height === 'number') {
      // 如果设定了高度则滚动高度
      return {
        y: height,
      };
    }

    return undefined;
  }, [height]);

  const title = useCallback(() => props.title, [props.title]);

  return useMemo(
    () => (
      <Table
        title={title}
        columns={columns}
        dataSource={dataSource}
        size={props.size}
        scroll={scroll}
        pagination={false}
      />
    ),
    [columns, dataSource]
  );
});
TagDataTableShared.defaultProps = {
  size: 'middle',
  rows: [],
};
TagDataTableShared.displayName = 'TagDataTableShared';
