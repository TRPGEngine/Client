import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRTCPeers } from '@rtc/hooks/useRTCPeers';
import { useRTCRoomStateSelector } from '@rtc/redux';
import { Button, Divider } from 'antd';
import { useRTCRoomClientContext } from '@rtc/RoomContext';
import _isNil from 'lodash/isNil';
import { VoicePeerController } from './VoicePeerController';
import { VoiceController } from './VoiceController';
import styled from 'styled-components';
import { Loading } from '../Loading';
import { useTranslation } from '@shared/i18n';

const VoiceMembersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const VoiceMembers: React.FC = TMemo(() => {
  const peers = useRTCPeers();

  return (
    <VoiceMembersContainer>
      {peers.map((peer) => (
        <VoicePeerController key={peer.id} peerId={peer.id} />
      ))}
    </VoiceMembersContainer>
  );
});
VoiceMembers.displayName = 'VoiceMembers';

export const VoiceRoomDetail: React.FC = TMemo(() => {
  const { client } = useRTCRoomClientContext();
  const roomId = useRTCRoomStateSelector((state) => state.room.roomId);
  const roomState = useRTCRoomStateSelector((state) => state.room.state);
  const { t } = useTranslation();

  const handleLeaveRoom = useCallback(() => {
    client?.close();
  }, [client?.close]);

  if (roomState === 'connecting') {
    return <Loading description={t('正在连接...')} />;
  }

  return (
    <div>
      <div>房间号: {roomId}</div>

      <div>状态: {roomState}</div>

      <VoiceController />

      <Button onClick={handleLeaveRoom}>离开房间</Button>

      <Divider />

      <VoiceMembers />
    </div>
  );
});
VoiceRoomDetail.displayName = 'VoiceRoomDetail';
