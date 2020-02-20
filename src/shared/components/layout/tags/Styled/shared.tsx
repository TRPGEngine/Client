import React, { useMemo } from 'react';
import { TagComponent } from '../type';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { LayoutProps } from '../../processor';
import styled from 'styled-components';
import { getChildrenText } from '../utils';

export const TagStyledShared: TagComponent = React.memo((props) => {
  const elements = [...props._childrenEl];
  const styleIndex = elements.findIndex((el) => el.name === 'Style');
  let style = '';
  if (styleIndex >= 0) {
    // 如果Style子组件存在
    const [styleEl] = elements.splice(styleIndex, 1);
    style = getChildrenText(styleEl);
  }

  const children = useLayoutChildren({ _childrenEl: elements } as LayoutProps);

  const Container = useMemo(
    () => styled.div`
      ${style}
    `,
    [style]
  );

  return <Container>{children}</Container>;
});
TagStyledShared.displayName = 'TagStyledShared';
