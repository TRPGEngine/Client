import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 2px;
  width: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  > .bar {
    width: 6px;
    border-radius: 6px;
    background: yellow;
    transition-property: height background-color;
    transition-duration: 0.25s;
    opacity: 0.65;

    &.level0 {
      height: 0;
      background-color: yellow;
    }
    &.level1 {
      height: 10%;
      background-color: yellow;
    }
    &.level2 {
      height: 20%;
      background-color: yellow;
    }
    &.level3 {
      height: 30%;
      background-color: yellow;
    }
    &.level4 {
      height: 40%;
      background-color: orange;
    }
    &.level5 {
      height: 50%;
      background-color: orange;
    }
    &.level6 {
      height: 60%;
      background-color: red;
    }
    &.level7 {
      height: 70%;
      background-color: red;
    }
    &.level8 {
      height: 80%;
      background-color: #000;
    }
    &.level9 {
      height: 90%;
      background-color: #000;
    }
    &.level10 {
      height: 100%;
      background-color: #000;
    }
  }
`;

interface Props {
  level: number; // 0 - 10
}
export const VolumeInspector: React.FC<Props> = TMemo((props) => {
  return (
    <Container>
      <div className={`bar level${props.level}`} />
    </Container>
  );
});
VolumeInspector.displayName = 'VolumeInspector';
