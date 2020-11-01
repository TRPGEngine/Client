import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRTCPeerConsumersAudio } from '@rtc/hooks/useRTCPeerConsumers';
import _isNil from 'lodash/isNil';
import { UserAvatar } from '../UserAvatar';
import { UserName } from '../UserName';
import styled from 'styled-components';
import { VoiceMic } from './VoiceMic';
import { useAudioVolumn } from './hooks/useAudioVolumn';

const Root = styled.div`
  display: flex;
  flex-direction: row;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
    const audioVolume = useAudioVolumn(audio?.track);

    return (
      <Root>
        <Info>
          <UserAvatar uuid={peerId} />
          <UserName uuid={peerId} />
        </Info>
        <Controller>
          <VoiceMic volume={audioVolume} />
        </Controller>
      </Root>
    );
  }
);
VoicePeerController.displayName = 'VoicePeerController';
