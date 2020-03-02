import React, { useMemo } from 'react';
import { useLayoutGrid } from '@shared/components/layout/hooks/useLayoutGrid';
import { Col } from 'antd';
import { useLayoutChildren } from '@shared/components/layout/hooks/useLayoutChildren';
import { TMemo } from '@shared/components/TMemo';
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
export const LayoutCol: React.FC<LayoutColProps> = TMemo((props) => {
  const newProps = useLayoutGrid(props);

  return <Col {...newProps}>{props.children}</Col>;
});
LayoutCol.displayName = 'LayoutCol';

export const TagColShared: TagComponent = TMemo((props) => {
  const children = useLayoutChildren(props);
  const colProps = useMemo(() => removePrivateProps(props), [props]);

  return <LayoutCol {...colProps}>{children}</LayoutCol>;
});
TagColShared.displayName = 'TagColShared';
