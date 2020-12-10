import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanelProps } from '@shared/components/panel/type';
import { useRTCRoomClientContext } from '@rtc/RoomContext';
import { getUserName } from '@shared/utils/data-helper';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { buildDeviceInfo } from '@web/utils/rtc-helper';
import { useRTCRoomStateSelector } from '@rtc/redux';
import styled from 'styled-components';
import { VoiceRoomDetail } from '../rtc/VoiceRoomDetail';
import { CommonPanel } from './CommonPanel';
import { useTranslation } from '@shared/i18n';

const Root = styled.div`
  overflow: auto;
  padding: 10px;
`;

const JoinRoomBtn = styled.div`
  margin: auto;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color['tacao']};
  border: 1px solid ${(props) => props.theme.color['tobacco-brown']};
  cursor: pointer;
  margin-top: 120px;
  color: white;
  font-size: 20px;

  &:active {
    margin-top: 121px;
  }
`;

/**
 * 语音频道
 */
export const VoiceChannel: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const channelUUID = panel.target_uuid;
  const channelName = panel.name;
  const { createClient } = useRTCRoomClientContext();
  const currentUserInfo = useCurrentUserInfo();
  const isInRoom = useRTCRoomStateSelector(
    (state) => state.room.roomId === channelUUID
  );
  const { t } = useTranslation();

  const handleJoinRoom = useCallback(() => {
    createClient({
      roomId: channelUUID,
      peerId: currentUserInfo.uuid ?? '',
      displayName: getUserName(currentUserInfo), // TODO: 这个应该取消
      device: buildDeviceInfo(),
    });
  }, [createClient, channelUUID, currentUserInfo]);

  return (
    <CommonPanel header={channelName}>
      <Root>
        {!isInRoom ? (
          <JoinRoomBtn onClick={handleJoinRoom}>{t('加入房间')} </JoinRoomBtn>
        ) : (
          <VoiceRoomDetail />
        )}
      </Root>
    </CommonPanel>
  );
});
VoiceChannel.displayName = 'VoiceChannel';
