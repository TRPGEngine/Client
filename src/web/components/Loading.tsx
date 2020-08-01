import React, { useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import LoadingSpinner from './LoadingSpinner';
import styled from 'styled-components';
import { useTimeout, useInterval } from 'react-use';
import _repeat from 'lodash/repeat';

const Description = styled.p`
  color: ${(props) => props.theme.color.textNormal};
  text-align: center;
`;

const LoadingDot: React.FC = TMemo(() => {
  const maxNum = 3 + 1;
  const [num, setNum] = useState(0);
  useInterval(() => {
    setNum((num + 1) % maxNum);
  }, 800);

  return <span>{_repeat('.', num)}</span>;
});
LoadingDot.displayName = 'LoadingDot';

interface LoadingProps {
  style?: React.CSSProperties;
  description?: string;
  showAnimation?: boolean;
}
export const Loading: React.FC<LoadingProps> = TMemo((props) => {
  const { style, description = '', showAnimation = false } = props;
  return (
    <div style={style}>
      <LoadingSpinner />
      <Description>
        {description}
        {showAnimation ? <LoadingDot /> : null}
      </Description>
    </div>
  );
});
Loading.displayName = 'Loading';
