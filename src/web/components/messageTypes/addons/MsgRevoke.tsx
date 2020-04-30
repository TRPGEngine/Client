import React from 'react';
import { TMemo } from '@shared/components/TMemo';

interface Props {
  senderName: string;
}
export const MsgRevoke: React.FC<Props> = TMemo(({ senderName }) => {
  return (
    <div className="msg-item-tip">
      <div className="content">{senderName} 撤回了一条消息</div>
    </div>
  );
});
MsgRevoke.displayName = 'MsgRevoke';
