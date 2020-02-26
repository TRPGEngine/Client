import React, { useMemo } from 'react';
import { TagComponent } from '../type';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { Row } from 'antd';
import { removePrivateProps } from '../utils';
import { TMemo } from '@shared/components/TMemo';

export const TagRowShared: TagComponent = TMemo((props) => {
  const children = useLayoutChildren(props);
  const rowProps = useMemo(() => removePrivateProps(props), [props]);

  return (
    <Row gutter={4} {...rowProps}>
      {children}
    </Row>
  );
});
TagRowShared.displayName = 'TagRowShared';
