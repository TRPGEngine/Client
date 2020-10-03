import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRTCPeers } from '@rtc/hooks/useRTCPeers';
import { useRTCRoomStateSelector } from '@rtc/redux';
import { Button } from 'antd';
import { useRTCRoomClientContext } from '@rtc/RoomContext';
import { UserName } from '../UserName';
import _isNil from 'lodash/isNil';

const VoiceMembers: React.FC = TMemo(() => {
  const me = useRTCRoomStateSelector((state) => state.me);
  const peers = useRTCPeers();

  return (
    <div>
      {!_isNil(me.id) && <UserName uuid={me.id} />}

      {peers.map((peer) => (
        <UserName key={peer.id} uuid={peer.id} />
      ))}
    </div>
  );
});
VoiceMembers.displayName = 'VoiceMembers';

export const VoiceRoomDetail: React.FC = TMemo(() => {
  const { client } = useRTCRoomClientContext();
  const roomState = useRTCRoomStateSelector((state) => state.room.state);

  const handleLeaveRoom = useCallback(() => {
    client?.close();
  }, [client?.close]);

  return (
    <div>
      <div>状态: {roomState}</div>
      <VoiceMembers />

      <Button onClick={handleLeaveRoom}>离开房间</Button>
    </div>
  );
});
VoiceRoomDetail.displayName = 'VoiceRoomDetail';
