import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import MessageHandler from '@web/components/messageTypes/__all__';
import type { ReportLogItem } from '@shared/model/trpg';
import { useUserInfo } from '@portal/hooks/useUserInfo';

interface Props {
  playerUUID: string; // 表示当前用户的UUID(即kp)
  logItem: ReportLogItem;
}
export const LogItem: React.FC<Props> = TMemo((props) => {
  const { logItem } = props;
  const userInfo = useUserInfo(logItem.sender_uuid);

  return (
    <MessageHandler
      key={logItem.uuid}
      type={logItem.type}
      me={logItem.sender_uuid === props.playerUUID}
      name={userInfo.nickname ?? userInfo.username}
      avatar={userInfo.avatar}
      emphasizeTime={false}
      info={logItem}
    />
  );
});
