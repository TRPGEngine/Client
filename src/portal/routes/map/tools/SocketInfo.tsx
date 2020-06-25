import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useMapMemberSocketInfo } from '@shared/api/trpg/hooks';
import { useUserInfo } from '@portal/hooks/useUserInfo';
import Avatar from '@web/components/Avatar';
import { Tooltip } from 'antd';

/**
 * Socket会话信息
 */
export const SocketInfo: React.FC<{
  socketId: string;
}> = TMemo((props) => {
  const info = useMapMemberSocketInfo(props.socketId);
  const userInfo = useUserInfo(info?.uuid);

  return (
    <Tooltip title={userInfo.name}>
      <Avatar name={userInfo.name} src={userInfo.avatar} size="small" />
    </Tooltip>
  );
});
SocketInfo.displayName = 'SocketInfo';
