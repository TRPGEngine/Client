import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRTCPeerConsumersAudio } from '@rtc/hooks/useRTCPeerConsumers';
import _isNil from 'lodash/isNil';
import { UserAvatar } from '../UserAvatar';
import { UserName } from '../UserName';
import styled from 'styled-components';
import { VoiceMic } from './VoiceMic';
import { useAudioVolume } from './hooks/useAudioVolume';
import { useRTCRoomStateDispatch } from '@rtc/redux';
import { mutedConsumer } from '@rtc/redux/stateActions';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
`;

const Controller = styled.div`
  display: flex;
  flex-direction: column;
`;

interface VoicePeerControllerProps {
  peerId: string;
}
export const VoicePeerController: React.FC<VoicePeerControllerProps> = TMemo(
  (props) => {
    const { peerId } = props;
    const audio = useRTCPeerConsumersAudio(peerId);
    const audioVolume = useAudioVolume(audio?.track);
    const dispatch = useRTCRoomStateDispatch();

    const handleSwitchAudioMuted = useCallback(() => {
      // 注意: 这里操作的不是peer，而是consumer
      if (!audio) {
        return;
      }

      dispatch(mutedConsumer(audio.id, !audio.muted));
    }, [audio]);

    return (
      <Root>
        <Info>
          <UserAvatar uuid={peerId} size={60} />
          <UserName uuid={peerId} />
        </Info>
        <Controller onClick={handleSwitchAudioMuted}>
          <VoiceMic volume={audioVolume} isMuted={audio?.muted ?? false} />
        </Controller>
      </Root>
    );
  }
);
VoicePeerController.displayName = 'VoicePeerController';
