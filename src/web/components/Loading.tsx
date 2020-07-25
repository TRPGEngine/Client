import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import LoadingSpinner from './LoadingSpinner';
import styled from 'styled-components';

const Description = styled.p`
  color: ${(props) => props.theme.color.textNormal};
  text-align: center;
`;

interface LoadingProps {
  style?: React.CSSProperties;
  description?: string;
}
export const Loading: React.FC<LoadingProps> = TMemo((props) => {
  const { style, description = '' } = props;
  return (
    <div style={style}>
      <LoadingSpinner />
      <Description>{description}</Description>
    </div>
  );
});
Loading.displayName = 'Loading';
