import React, { useMemo } from 'react';
import { useLayoutGrid } from '@shared/components/layout/hooks/useLayoutGrid';
import { Col } from 'antd';
import { useLayoutChildren } from '@shared/components/layout/hooks/useLayoutChildren';
import { TagComponent } from '../type';
import { removePrivateProps } from '../utils';

interface LayoutColProps {
  xxl?: number;
  xl?: number;
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
  span?: number;
  [attrs: string]: any;
}
export const LayoutCol: React.FC<LayoutColProps> = React.memo((props) => {
  const newProps = useLayoutGrid(props);

  return <Col {...newProps}>{props.children}</Col>;
});

export const TagColShared: TagComponent = React.memo((props) => {
  const children = useLayoutChildren(props);
  const colProps = useMemo(() => removePrivateProps(props), [props]);

  return <LayoutCol {...colProps}>{children}</LayoutCol>;
});
TagColShared.displayName = 'TagColShared';
