import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { MsgContainerContextProvider } from '@shared/context/MsgContainerContext';
import { ChatMsgList } from './ChatMsgList';
import { GroupMsgReply } from '@web/containers/main/group/GroupMsgReply';
import { ChatSendBox } from './ChatSendBox';

interface ChatBodyProps {
  converseUUID: string;
}
export const ChatBody: React.FC<ChatBodyProps> = TMemo((props) => {
  const { converseUUID } = props;

  return (
    <MsgContainerContextProvider>
      <ChatMsgList converseUUID={converseUUID} />
      <GroupMsgReply />
      <ChatSendBox converseUUID={converseUUID} />
    </MsgContainerContextProvider>
  );
});
ChatBody.displayName = 'ChatBody';
