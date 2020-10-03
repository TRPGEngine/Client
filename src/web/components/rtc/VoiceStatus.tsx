import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRTCRoomStateSelector } from '@rtc/redux';
import { Badge } from 'antd';
import _isString from 'lodash/isString';
import styled from 'styled-components';

const Root = styled.div`
  height: 10px;
  width: 100%;
  position: relative;
`;

const StatusBadge = styled(Badge).attrs({
  status: 'processing',
  text: '通话中',
})`
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;

  .ant-badge-status-text {
    font-size: 10px;
  }
`;

/**
 * 语音状态
 */
export const VoiceStatus: React.FC = TMemo(() => {
  const roomId = useRTCRoomStateSelector((state) => state.room.roomId);

  return <Root>{_isString(roomId) && <StatusBadge />}</Root>;
});
VoiceStatus.displayName = 'VoiceStatus';
