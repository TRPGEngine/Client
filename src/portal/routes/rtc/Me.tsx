import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  useRoomClientContext,
  useRoomStateSelector,
  useRoomStateDispatch,
} from '@src/rtc/RoomContext';
import { PeerView } from './PeerView';
import * as stateActions from '@src/rtc/redux/stateActions';
import { MeController } from './MeController';

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

  const videoVisible = useMemo(
    () => Boolean(videoProducer) && !videoProducer.paused,
    [videoProducer, videoProducer?.paused]
  );

  return (
    <div>
      <PeerView
        isMe
        peer={me}
        audioProducerId={audioProducer ? audioProducer.id : null}
        videoProducerId={videoProducer ? videoProducer.id : null}
        audioRtpParameters={audioProducer ? audioProducer.rtpParameters : null}
        videoRtpParameters={videoProducer ? videoProducer.rtpParameters : null}
        audioTrack={audioProducer ? audioProducer.track : null}
        videoTrack={videoProducer ? videoProducer.track : null}
        videoVisible={videoVisible}
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
