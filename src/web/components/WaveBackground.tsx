import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled, { keyframes } from 'styled-components';

const imagePath = '/src/web/assets/img/wave_white.svg';

const wave = keyframes`
  0% {
    margin-left: 0;
  }

  100% {
    margin-left: -3056px;
  }
`;

const swell = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -30px, 0);
  }
`;

const Ocean = styled.div`
  height: 0;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: #015871;

  > * {
    background-image: url(${imagePath});
    background-repeat: repeat-x;
    background-size: contain;
    position: absolute;
    top: -170px;
    width: 6112px;
    height: 170px;
    transform: translate3d(0, 0, 0);
  }
`;

const Wave01 = styled.div`
  animation: ${wave} 26s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
`;
const Wave02 = styled.div`
  top: -140px;
  background-position-x: 50%;
  animation: ${wave} 38s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite,
    ${swell} 5s ease -1.25s infinite;
  transform: translate3d(0, 0, 0);
`;

/**
 * 波浪背景
 */
export const WaveBackground: React.FC = TMemo(() => {
  return (
    <Ocean>
      <Wave01 />
      <Wave02 />
    </Ocean>
  );
});
WaveBackground.displayName = 'WaveBackground';
