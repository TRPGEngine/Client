import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { MsgItemTip } from '../style';

interface Props {
  senderName: string;
}
export const MsgRevoke: React.FC<Props> = TMemo(({ senderName }) => {
  return (
    <MsgItemTip>
      <div className="content">{senderName} 撤回了一条消息</div>
    </MsgItemTip>
  );
});
MsgRevoke.displayName = 'MsgRevoke';
