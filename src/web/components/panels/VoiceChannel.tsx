import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanelProps } from '@shared/components/panel/type';
import { Button } from 'antd';
import { useRTCRoomClientContext } from '@rtc/RoomContext';
import { useRTCPeers } from '@rtc/hooks/useRTCPeers';
import { getUserName } from '@shared/utils/data-helper';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { buildDeviceInfo } from '@web/utils/rtc-helper';

const VoiceMembers: React.FC = TMemo(() => {
  const peers = useRTCPeers();

  return <div>{JSON.stringify(peers.map((p) => p.id))}</div>;
});
VoiceMembers.displayName = 'VoiceMembers';

/**
 * 语音频道
 */
export const VoiceChannel: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const channelUUID = panel.target_uuid;
  const { client, createClient } = useRTCRoomClientContext();
  const currentUserInfo = useCurrentUserInfo();

  const isInRoom = client?.roomId === channelUUID;

  const handleJoinChannel = useCallback(() => {
    createClient({
      roomId: channelUUID,
      peerId: currentUserInfo.uuid ?? '',
      displayName: getUserName(currentUserInfo), // TODO: 这个应该取消
      device: buildDeviceInfo(),
    });
  }, [createClient, channelUUID, currentUserInfo]);

  return (
    <div>
      {!isInRoom ? (
        <Button onClick={handleJoinChannel}>加入房间</Button>
      ) : (
        <div>
          <div>已加入房间</div>
          <VoiceMembers />
        </div>
      )}
    </div>
  );
});
VoiceChannel.displayName = 'VoiceChannel';
