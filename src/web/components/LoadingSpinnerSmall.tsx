import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Icon = styled.i.attrs({
  className: 'iconfont loading',
})`
  display: inline-block;
  width: 18px;
  height: 18px;
  vertical-align: bottom;
  margin: 4px;
  animation: ${rotate} 1s linear infinite;
  line-height: 18px;
  font-size: 18px;
`;

export const LoadingSpinnerSmall: React.FC = TMemo(() => {
  return <Icon>&#xeb0f;</Icon>;
});
LoadingSpinnerSmall.displayName = 'LoadingSpinnerSmall';
