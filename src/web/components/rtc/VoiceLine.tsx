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
    background-color: lightgreen;
  }
  &.level1 {
    width: 10%;
    background-color: lightgreen;
  }
  &.level2 {
    width: 20%;
    background-color: lightgreen;
  }
  &.level3 {
    width: 30%;
    background-color: lightgreen;
  }
  &.level4 {
    width: 40%;
    background-color: yellow;
  }
  &.level5 {
    width: 50%;
    background-color: yellow;
  }
  &.level6 {
    width: 60%;
    background-color: orange;
  }
  &.level7 {
    width: 70%;
    background-color: orange;
  }
  &.level8 {
    width: 80%;
    background-color: red;
  }
  &.level9 {
    width: 90%;
    background-color: red;
  }
  &.level10 {
    width: 100%;
    background-color: red;
  }
`;

export const VoiceLine: React.FC<{
  level: number;
}> = TMemo((props) => {
  return <Root className={`level${props.level}`} />;
});
VoiceLine.displayName = 'VoiceLine';
