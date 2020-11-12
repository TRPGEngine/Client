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
import { VoiceNetwork } from './VoiceNetwork';
import { RoomState } from '@rtc/redux/types/room';

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

/**
 * 获取房间状态的文本
 * @param roomState 房间状态
 */
function getRoomStateLabel(roomState: RoomState): string {
  if (roomState === 'new') {
    return '新建连接';
  } else if (roomState === 'connected') {
    return '已连接';
  } else if (roomState === 'closed') {
    return '已关闭';
  } else if (roomState === 'connecting') {
    return '正在连接';
  } else {
    return '';
  }
}

export const VoiceRoomDetail: React.FC = TMemo(() => {
  const { deleteClient } = useRTCRoomClientContext();
  const roomId = useRTCRoomStateSelector((state) => state.room.roomId);
  const roomState = useRTCRoomStateSelector((state) => state.room.state);
  const { t } = useTranslation();

  if (roomState === 'connecting') {
    return <Loading description={t('正在连接...')} />;
  }

  return (
    <div>
      <div>房间号: {roomId}</div>

      <div style={{ marginBottom: 6 }}>
        状态: {getRoomStateLabel(roomState)}
      </div>

      <VoiceController />

      <VoiceNetwork />

      <Button danger={true} onClick={deleteClient}>
        离开房间
      </Button>

      <Divider />

      <VoiceMembers />
    </div>
  );
});
VoiceRoomDetail.displayName = 'VoiceRoomDetail';
