import React from 'react';
import { TagProps } from '@shared/components/bbcode/type';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';

const Root = styled.span`
  margin: 0 4px;
  color: ${(props) => props.theme.color['textLink']};
  user-select: none;
`;
export const AtTag: React.FC<TagProps> = TMemo((props) => {
  const { node } = props;
  const text = node.content.join('');

  return <Root>@{text}</Root>;
});
AtTag.displayName = 'AtTag';
