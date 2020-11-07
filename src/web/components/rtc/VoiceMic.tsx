import React, { Fragment } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Iconfont } from '../Iconfont';

const VoiceMicIcon = styled(Iconfont)<{
  volume: number; // 0 - 10
}>`
  font-size: 24px;
  position: relative;
  transition: color 0.2s linear;
  color: ${(props) =>
    props.volume < 4 ? 'yellow' : props.volume < 6 ? 'orange' : 'red'};

  & > .mask {
    display: block;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    transition: height 0.2s linear;
    height: ${(props) => `${(8 - props.volume) * 10}%`};
    overflow: hidden;
    color: white;
  }
`;

/**
 * 麦克风图标与状态
 */
interface Props {
  volume: number; // 0 - 10
  isMuted: boolean;
}
export const VoiceMic: React.FC<Props> = TMemo((props) => {
  return (
    <VoiceMicIcon volume={props.volume}>
      {props.isMuted ? (
        <Fragment>
          <Iconfont className="mask">&#xe67e;</Iconfont>
          &#xe67e;
        </Fragment>
      ) : (
        <Fragment>
          <Iconfont className="mask">&#xe664;</Iconfont>&#xe664;
        </Fragment>
      )}
    </VoiceMicIcon>
  );
});
VoiceMic.displayName = 'VoiceMic';
