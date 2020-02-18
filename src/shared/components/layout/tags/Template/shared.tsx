import React from 'react';
import styled from 'styled-components';
import { TagComponent } from '../type';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';

const TemplateContainer = styled.div`
  padding: 10px;
`;

export const TagTemplateShared: TagComponent = React.memo((props) => {
  const children = useLayoutChildren(props);

  return <TemplateContainer>{children}</TemplateContainer>;
});
TagTemplateShared.displayName = 'TagTemplateShared';
