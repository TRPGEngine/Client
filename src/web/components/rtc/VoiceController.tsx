/**
 * 个人控制器
 * 与成员的控制器区别在于
 * 成员控制器的控制是依旧接受数据但是不播放
 * 个人控制器是控制是否传输数据
 */

import React, { useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Button, Tooltip } from 'antd';
import { CapablityState } from '@rtc/type';
import { useRTCRoomStateSelector } from '@rtc/redux';
import { Iconfont } from '../Iconfont';
import { useRTCAudioProducer } from '@rtc/hooks/useRTCProducers';
import { useRTCRoomClientContext } from '@rtc/RoomContext';
import { useAudioVolume } from './hooks/useAudioVolume';

const CapablityBtn = styled(Button).attrs({
  shape: 'circle',
})`
  &.unsupported,
  &.off {
    color: ${(props) => props.theme.color['silver']};
  }
`;

export const VoiceController: React.FC = TMemo(() => {
  const { client } = useRTCRoomClientContext();
  const me = useRTCRoomStateSelector((state) => state.me);
  const audioProducer = useRTCAudioProducer();
  const audioVolumn = useAudioVolume(audioProducer?.track);

  // 麦克风状态
  const micState: CapablityState = useMemo(() => {
    if (!me.canSendMic) {
      return 'unsupported';
    } else if (!audioProducer) {
      return 'unsupported';
    } else if (!audioProducer.paused) {
      return 'on';
    } else {
      return 'off';
    }
  }, [me.canSendMic, audioProducer, audioProducer?.paused]);

  const handleSwitchMic = useCallback(() => {
    if (micState === 'on') {
      client?.muteMic();
    } else {
      client?.unmuteMic();
    }
  }, [micState, client]);

  return (
    <div>
      <CapablityBtn className={micState} onClick={handleSwitchMic}>
        {micState === 'on' ? (
          <Tooltip title="关闭语音">
            <Iconfont>&#xe666;</Iconfont>
          </Tooltip>
        ) : (
          <Tooltip title="开启语音">
            <Iconfont>&#xe667;</Iconfont>
          </Tooltip>
        )}
      </CapablityBtn>

      <div>当前音量: {audioVolumn}</div>
    </div>
  );
});
VoiceController.displayName = 'VoiceController';
