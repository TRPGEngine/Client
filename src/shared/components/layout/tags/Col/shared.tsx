import React from 'react';
import { useLayoutGrid } from '@shared/components/layout/hooks/useLayoutGrid';
import { Col } from 'antd';
import { useLayoutChildren } from '@shared/components/layout/hooks/useLayoutChildren';
import { TagComponent } from '../type';

export const TagColShared: TagComponent = React.memo((props) => {
  const newProps = useLayoutGrid(props);
  const children = useLayoutChildren(props);

  // return <div>col: {width}</div>;
  return <Col {...newProps}>{children}</Col>;
});
TagColShared.displayName = 'TagColShared';
