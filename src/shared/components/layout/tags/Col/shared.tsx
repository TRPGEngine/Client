import React, { useMemo } from 'react';
import { useLayoutGrid } from '@shared/components/layout/hooks/useLayoutGrid';
import { Col } from 'antd';
import { useLayoutChildren } from '@shared/components/layout/hooks/useLayoutChildren';
import { TagComponent } from '../type';
import { removePrivateProps } from '../utils';

export const TagColShared: TagComponent = React.memo((props) => {
  const newProps = useLayoutGrid(props);
  const children = useLayoutChildren(props);

  const colProps = useMemo(() => removePrivateProps(newProps), [newProps]);

  return <Col {...colProps}>{children}</Col>;
});
TagColShared.displayName = 'TagColShared';
