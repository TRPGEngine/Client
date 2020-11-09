import { TMemo } from '@shared/components/TMemo';
import React from 'react';
import styled from 'styled-components';

/**
 * 用于表示音量等级的线
 * 有颜色区分
 */

const Root = styled.div`
  height: 4px;
  border-radius: 2px;
  transition: all 0.3s linear;
  margin: 10px 0;

  &.level0 {
    width: 0;
    background-color: yellow;
  }
  &.level1 {
    width: 10%;
    background-color: yellow;
  }
  &.level2 {
    width: 20%;
    background-color: yellow;
  }
  &.level3 {
    width: 30%;
    background-color: yellow;
  }
  &.level4 {
    width: 40%;
    background-color: orange;
  }
  &.level5 {
    width: 50%;
    background-color: orange;
  }
  &.level6 {
    width: 60%;
    background-color: red;
  }
  &.level7 {
    width: 70%;
    background-color: red;
  }
  &.level8 {
    width: 80%;
    background-color: #000;
  }
  &.level9 {
    width: 90%;
    background-color: #000;
  }
  &.level10 {
    width: 100%;
    background-color: #000;
  }
`;

export const VoiceLine: React.FC<{
  level: number;
}> = TMemo((props) => {
  return <Root className={`level${props.level}`} />;
});
VoiceLine.displayName = 'VoiceLine';
