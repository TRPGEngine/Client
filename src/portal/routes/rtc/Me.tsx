import React, { useMemo, useState, Fragment } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  useRoomClientContext,
  useRoomStateSelector,
  useRoomStateDispatch,
} from '@src/rtc/RoomContext';
import { PeerView } from './PeerView';
import * as stateActions from '@src/rtc/redux/stateActions';
import * as settingManager from '@src/rtc/settingManager';
import { Button } from 'antd';

export const Me: React.FC = TMemo(() => {
  const client = useRoomClientContext();
  const me = useRoomStateSelector((state) => state.me);
  const producers = useRoomStateSelector((state) => state.producers);
  const room = useRoomStateSelector((state) => state.room);
  const dispatch = useRoomStateDispatch();

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

  const connected = useMemo(() => room.state === 'connected', [room.state]);

  let micState;

  if (!me.canSendMic) micState = 'unsupported';
  else if (!audioProducer) micState = 'unsupported';
  else if (!audioProducer.paused) micState = 'on';
  else micState = 'off';

  let webcamState;

  if (!me.canSendWebcam) webcamState = 'unsupported';
  else if (videoProducer && videoProducer.type !== 'share') webcamState = 'on';
  else webcamState = 'off';

  return (
    <div>
      <div>state: {room.state}</div>
      {connected && (
        <Fragment>
          <div className="controls">
            <Button
              onClick={() => {
                micState === 'on' ? client.muteMic() : client.unmuteMic();
              }}
            >
              {micState === 'on' ? '关闭' : '开启'}
              语音
            </Button>

            <Button
              onClick={() => {
                if (webcamState === 'on') {
                  settingManager.setDevices({ webcamEnabled: false });
                  client.disableWebcam();
                } else {
                  settingManager.setDevices({ webcamEnabled: true });
                  client.enableWebcam();
                }
              }}
            >
              {webcamState === 'on' ? '关闭' : '开启'} 视频
            </Button>

            <Button onClick={() => client.changeWebcam()}>切换摄像头</Button>
          </div>
        </Fragment>
      )}
      <PeerView
        isMe
        peer={me}
        audioProducerId={audioProducer ? audioProducer.id : null}
        videoProducerId={videoProducer ? videoProducer.id : null}
        audioRtpParameters={audioProducer ? audioProducer.rtpParameters : null}
        videoRtpParameters={videoProducer ? videoProducer.rtpParameters : null}
        audioTrack={audioProducer ? audioProducer.track : null}
        videoTrack={videoProducer ? videoProducer.track : null}
        videoVisible={true}
        audioCodec={audioProducer ? audioProducer.codec : null}
        videoCodec={videoProducer ? videoProducer.codec : null}
        audioScore={audioProducer ? audioProducer.score : null}
        videoScore={videoProducer ? videoProducer.score : null}
        onChangeDisplayName={(displayName) => {
          client.changeDisplayName(displayName);
        }}
        onChangeMaxSendingSpatialLayer={(spatialLayer) => {
          client.setMaxSendingSpatialLayer(spatialLayer);
        }}
        onStatsClick={(peerId) => {
          dispatch(stateActions.setRoomStatsPeerId(peerId));
        }}
      />
    </div>
  );
});
Me.displayName = 'Me';
