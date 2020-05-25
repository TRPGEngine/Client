import React, { useMemo, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  useRoomClientContext,
  useRoomStateSelector,
} from '@src/rtc/RoomContext';
import { Button, Tooltip } from 'antd';
import { setDevices } from '@src/rtc/settingManager';
import styled from 'styled-components';

type CapablityState = 'on' | 'off' | 'unsupported';

const CapablityBtn = styled(Button).attrs({
  shape: 'circle',
})`
  &.unsupported,
  &.off {
    color: ${(props) => props.theme.color['silver']};
  }
`;

export const MeController: React.FC = TMemo(() => {
  const client = useRoomClientContext();
  const me = useRoomStateSelector((state) => state.me);

  const producers = useRoomStateSelector((state) => state.producers);
  const producersArray = useMemo(() => Object.values<any>(producers), [
    producers,
  ]);
  const audioProducer = useMemo(
    () => producersArray.find((producer) => producer.track.kind === 'audio'),
    [producersArray]
  );
  const videoProducer = useMemo(
    () => producersArray.find((producer) => producer.track.kind === 'video'),
    [producersArray]
  );

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

  // 摄像头状态
  const webcamState: CapablityState = useMemo(() => {
    if (!me.canSendWebcam) {
      return 'unsupported';
    } else if (videoProducer && videoProducer.type !== 'share') {
      return 'on';
    } else {
      return 'off';
    }
  }, [me.canSendWebcam, videoProducer, videoProducer?.type]);

  const changeWebcamState: CapablityState = useMemo(() => {
    if (
      Boolean(videoProducer) &&
      videoProducer.type !== 'share' &&
      me.canChangeWebcam
    ) {
      return 'on';
    } else {
      return 'unsupported';
    }
  }, [videoProducer, videoProducer?.type, me.canChangeWebcam]);

  const shareState: CapablityState = useMemo(() => {
    if (Boolean(videoProducer) && videoProducer.type === 'share') {
      return 'on';
    } else {
      return 'off';
    }
  }, []);

  const handleSwitchMic = useCallback(() => {
    micState === 'on' ? client.muteMic() : client.unmuteMic();
  }, [micState, client]);

  const handleSwitchWebcam = useCallback(() => {
    if (webcamState === 'on') {
      setDevices({ webcamEnabled: false });
      client.disableWebcam();
    } else {
      setDevices({ webcamEnabled: true });
      client.enableWebcam();
    }
  }, [webcamState, client]);

  const handleChangeWebcam = useCallback(() => {
    client.changeWebcam();
  }, [client]);

  const handleSwitchShareScreen = useCallback(() => {
    if (shareState === 'on') {
      client.disableShare();
    } else {
      client.enableShare();
    }
  }, [shareState, client]);

  return (
    <div>
      <CapablityBtn className={micState} onClick={handleSwitchMic}>
        {micState === 'on' ? (
          <Tooltip title="关闭语音">
            <i className="iconfont">&#xe666;</i>
          </Tooltip>
        ) : (
          <Tooltip title="开启语音">
            <i className="iconfont">&#xe667;</i>
          </Tooltip>
        )}
      </CapablityBtn>

      <CapablityBtn
        className={webcamState}
        disabled={me.webcamInProgress || me.shareInProgress}
        onClick={handleSwitchWebcam}
      >
        {webcamState === 'on' ? (
          <Tooltip title="关闭视频">
            <i className="iconfont">&#xe913;</i>
          </Tooltip>
        ) : (
          <Tooltip title="开启视频">
            <i className="iconfont">&#xe8ff;</i>
          </Tooltip>
        )}
      </CapablityBtn>

      <CapablityBtn
        className={changeWebcamState}
        disabled={me.webcamInProgress || me.shareInProgress}
        onClick={handleChangeWebcam}
      >
        <i className="iconfont">&#xe9ac;</i>
      </CapablityBtn>

      <CapablityBtn
        className={shareState}
        disabled={me.shareInProgress || me.webcamInProgress}
        onClick={handleSwitchShareScreen}
      >
        <Tooltip title={shareState === 'on' ? '取消分享屏幕' : '开始分享屏幕'}>
          <i className="iconfont">&#xe69e;</i>
        </Tooltip>
      </CapablityBtn>
    </div>
  );
});
MeController.displayName = 'MeController';
