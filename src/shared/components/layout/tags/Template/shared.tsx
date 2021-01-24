import React from 'react';
import styled from 'styled-components';
import type { TagComponent } from '../type';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { TMemo } from '@shared/components/TMemo';

const TemplateContainer = styled.div`
  padding: 10px;
`;

export const TagTemplateShared: TagComponent = TMemo((props) => {
  const children = useLayoutChildren(props);

  return <TemplateContainer>{children}</TemplateContainer>;
});
TagTemplateShared.displayName = 'TagTemplateShared';
