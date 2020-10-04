import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRTCPeers } from '@rtc/hooks/useRTCPeers';
import { useRTCRoomStateSelector } from '@rtc/redux';
import { Button } from 'antd';
import { useRTCRoomClientContext } from '@rtc/RoomContext';
import _isNil from 'lodash/isNil';
import { VoicePeerController } from './VoicePeerController';

const VoiceMembers: React.FC = TMemo(() => {
  const peers = useRTCPeers();

  return (
    <div>
      {peers.map((peer) => (
        <VoicePeerController key={peer.id} peerId={peer.id} />
      ))}
    </div>
  );
});
VoiceMembers.displayName = 'VoiceMembers';

export const VoiceRoomDetail: React.FC = TMemo(() => {
  const { client } = useRTCRoomClientContext();
  const roomId = useRTCRoomStateSelector((state) => state.room.roomId);
  const roomState = useRTCRoomStateSelector((state) => state.room.state);

  const handleLeaveRoom = useCallback(() => {
    client?.close();
  }, [client?.close]);

  return (
    <div>
      <div>房间号: {roomId}</div>

      <div>状态: {roomState}</div>
      <VoiceMembers />

      <Button onClick={handleLeaveRoom}>离开房间</Button>
    </div>
  );
});
VoiceRoomDetail.displayName = 'VoiceRoomDetail';
