import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled, { keyframes } from 'styled-components';
import imageUrl from '../assets/img/logo@192.png';

// Like grafana: https://github.com/grafana/grafana/pull/13040/files

const loadingBounce = keyframes`
  from,
  to {
    transform: translateY(0px);
    animation-timing-function: cubic-bezier(0.3, 0.0, 0.1, 1)
  }
  50% {
    transform: translateY(-50px);
    animation-timing-function: cubic-bezier(.9, 0, .7, 1)
  }
`;

const loadingSquash = keyframes`
  0% {
    transform: scaleX(1.3) scaleY(.8);
    animation-timing-function: cubic-bezier(.3, 0, .1, 1);
    transform-origin: bottom center;

    transform: translateY(0px);
    animation-timing-function: cubic-bezier(0.3, 0.0, 0.1, 1)
  }
  15% {
    transform: scaleX(.75) scaleY(1.25);
    animation-timing-function: cubic-bezier(0, 0, .7, .75);
    transform-origin: bottom center;
  }
  55% {
    transform: scaleX(1.05) scaleY(.95);
    animation-timing-function: cubic-bezier(.9, 0, 1, 1);
    transform-origin: top center;
  }
  95% {
    transform: scaleX(.75) scaleY(1.25);
    animation-timing-function: cubic-bezier(0, 0, 0, 1);
    transform-origin: bottom center;
  }
  100% {
    transform: scaleX(1.3) scaleY(.8);
    transform-origin: bottom center;
    animation-timing-function: cubic-bezier(0, 0, 0.7, 1);
  }
`;

const Logo = styled.div<{
  enabled: boolean;
}>`
  text-align: center;
  animation-name: ${({ enabled = true }) => (enabled ? loadingBounce : 'none')};
  animation-duration: 0.9s;
  animation-iteration-count: infinite;

  > div {
    display: inline-block;
    animation-name: ${({ enabled = true }) =>
      enabled ? loadingSquash : 'none'};
    animation-duration: 0.9s;
    animation-iteration-count: infinite;
    width: 60px;
    height: 60px;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url(${imageUrl});
  }
`;

interface Props {
  enabled?: boolean;
}
export const JumpLogo: React.FC<Props> = TMemo((props) => {
  const { enabled = true } = props;

  return (
    <Logo enabled={enabled}>
      <div />
    </Logo>
  );
});
JumpLogo.displayName = 'JumpLogo';
