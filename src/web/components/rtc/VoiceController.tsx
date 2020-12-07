/**
 * 个人控制器
 * 与成员的控制器区别在于
 * 成员控制器的控制是依旧接受数据但是不播放
 * 个人控制器是控制是否传输数据
 */

import React, { useCallback, useMemo, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Button, Space, Tooltip } from 'antd';
import { CapablityState } from '@rtc/type';
import { useRTCRoomStateDispatch, useRTCRoomStateSelector } from '@rtc/redux';
import { Iconfont } from '../Iconfont';
import { useRTCAudioProducer } from '@rtc/hooks/useRTCProducers';
import { useRTCRoomClientContext } from '@rtc/RoomContext';
import { useAudioVolume } from './hooks/useAudioVolume';
import { setAudioMutedState } from '@rtc/redux/stateActions';
import { VoiceLine } from './VoiceLine';
import { useTranslation } from '@shared/i18n';

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
  const audioVolume = useAudioVolume(audioProducer?.track);
  const dispatch = useRTCRoomStateDispatch();
  const isRecordingAudio = useRTCRoomStateSelector(
    (state) => state.recorder.isRecordingAudio
  );
  const { t } = useTranslation();

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

  const volume = useMemo(() => {
    if (micState === 'off' || micState === 'unsupported') {
      return 0;
    }

    return audioVolume;
  }, [audioVolume, micState]);

  const handleSwitchMic = useCallback(() => {
    if (micState === 'on') {
      // 麦克风静音
      client?.muteMic();
    } else {
      // 麦克风取消静音
      client?.unmuteMic();
    }
  }, [micState, client]);

  const handleSwitchAudioVolumn = useCallback(() => {
    dispatch(setAudioMutedState(!me.audioMuted));
  }, [me.audioMuted]);

  const handleSwitchRecordAudio = useCallback(() => {
    if (isRecordingAudio === false) {
      client?.startRecordAudio();
    } else {
      client?.stopRecordAudio();
    }
  }, [isRecordingAudio]);

  return (
    <div>
      <Space>
        <CapablityBtn className={micState} onClick={handleSwitchMic}>
          {micState === 'on' ? (
            <Tooltip title={t('关闭语音')}>
              <Iconfont>&#xe666;</Iconfont>
            </Tooltip>
          ) : (
            <Tooltip title={t('开启语音')}>
              <Iconfont>&#xe667;</Iconfont>
            </Tooltip>
          )}
        </CapablityBtn>

        <Button shape="circle" onClick={handleSwitchAudioVolumn}>
          {!me.audioMuted ? (
            <Tooltip title={t('关闭音量')}>
              <Iconfont>&#xe664;</Iconfont>
            </Tooltip>
          ) : (
            <Tooltip title={t('开启音量')}>
              <Iconfont>&#xe67e;</Iconfont>
            </Tooltip>
          )}
        </Button>

        <Button shape="circle" onClick={handleSwitchRecordAudio}>
          {isRecordingAudio === false ? (
            <Tooltip title="开始录音">
              <Iconfont>&#xe8d1;</Iconfont>
            </Tooltip>
          ) : (
            <Tooltip title="结束录音">
              <Iconfont style={{ color: 'red' }}>&#xe8d1;</Iconfont>
            </Tooltip>
          )}
        </Button>
      </Space>

      <VoiceLine level={volume} />
    </div>
  );
});
VoiceController.displayName = 'VoiceController';
