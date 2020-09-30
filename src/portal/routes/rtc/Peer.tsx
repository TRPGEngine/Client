import React, { useCallback } from 'react';
import { useRTCRoomClientContext } from '@src/rtc/RoomContext';
import * as stateActions from '@src/rtc/redux/stateActions';
import { PeerView } from './PeerView';
import { TMemo } from '@shared/components/TMemo';
import { useRTCRoomStateDispatch, useRTCRoomStateSelector } from '@rtc/redux';
import {
  useRTCPeerConsumersAudio,
  useRTCPeerConsumersVideo,
} from '@rtc/hooks/useRTCPeerConsumers';
import _isNil from 'lodash/isNil';

export const Peer: React.FC<{
  id: string; // peerId
}> = TMemo((props) => {
  const roomClient = useRTCRoomClientContext();
  const peer = useRTCRoomStateSelector((state) => state.peers[props.id]);
  const audioConsumer = useRTCPeerConsumersAudio(props.id);
  const videoConsumer = useRTCPeerConsumersVideo(props.id);

  const dispatch = useRTCRoomStateDispatch();
  const handleStatsClick = useCallback(
    (peerId: string) => {
      dispatch(stateActions.setRoomStatsPeerId(peerId));
    },
    [dispatch]
  );

  const audioMuted = useRTCRoomStateSelector((state) => state.me.audioMuted);

  const audioEnabled =
    !_isNil(audioConsumer) &&
    !audioConsumer.locallyPaused &&
    !audioConsumer.remotelyPaused;

  const videoVisible =
    !_isNil(videoConsumer) &&
    !videoConsumer.locallyPaused &&
    !videoConsumer.remotelyPaused;

  return (
    <div data-component="Peer">
      <div className="indicators">
        {!audioEnabled && <div>音频已关闭</div>}

        {!videoConsumer && <div>视频已关闭</div>}
      </div>

      <PeerView
        peer={peer}
        audioConsumerId={audioConsumer ? audioConsumer.id : null}
        videoConsumerId={videoConsumer ? videoConsumer.id : null}
        audioRtpParameters={audioConsumer ? audioConsumer.rtpParameters : null}
        videoRtpParameters={videoConsumer ? videoConsumer.rtpParameters : null}
        consumerSpatialLayers={
          videoConsumer ? videoConsumer.spatialLayers : null
        }
        consumerTemporalLayers={
          videoConsumer ? videoConsumer.temporalLayers : null
        }
        consumerCurrentSpatialLayer={
          videoConsumer ? videoConsumer.currentSpatialLayer : null
        }
        consumerCurrentTemporalLayer={
          videoConsumer ? videoConsumer.currentTemporalLayer : null
        }
        consumerPreferredSpatialLayer={
          videoConsumer ? videoConsumer.preferredSpatialLayer : null
        }
        consumerPreferredTemporalLayer={
          videoConsumer ? videoConsumer.preferredTemporalLayer : null
        }
        consumerPriority={videoConsumer ? videoConsumer.priority : null}
        audioTrack={audioConsumer ? audioConsumer.track : null}
        videoTrack={videoConsumer ? videoConsumer.track : null}
        audioMuted={audioMuted}
        videoVisible={videoVisible}
        videoMultiLayer={videoConsumer && videoConsumer.type !== 'simple'}
        audioCodec={audioConsumer ? audioConsumer.codec : null}
        videoCodec={videoConsumer ? videoConsumer.codec : null}
        audioScore={audioConsumer ? audioConsumer.score : null}
        videoScore={videoConsumer ? videoConsumer.score : null}
        onChangeVideoPreferredLayers={(spatialLayer, temporalLayer) => {
          roomClient.setConsumerPreferredLayers(
            videoConsumer.id,
            spatialLayer,
            temporalLayer
          );
        }}
        onChangeVideoPriority={(priority) => {
          roomClient.setConsumerPriority(videoConsumer.id, priority);
        }}
        onRequestKeyFrame={() => {
          roomClient.requestConsumerKeyFrame(videoConsumer.id);
        }}
        onStatsClick={handleStatsClick}
      />
    </div>
  );
});
Peer.displayName = 'Peer';
