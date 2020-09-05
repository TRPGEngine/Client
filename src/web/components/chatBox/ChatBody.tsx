import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { MsgContainerContextProvider } from '@shared/context/MsgContainerContext';
import { ChatMsgList } from './ChatMsgList';
import { GroupMsgReply } from '@web/containers/main/group/GroupMsgReply';
import { ChatSendBox } from './ChatSendBox';
import { useWritingState } from '@redux/hooks/chat';
import { ChatWritingIndicator } from '../ChatWritingIndicator';

interface ChatBodyProps {
  converseUUID: string;
}
export const ChatBody: React.FC<ChatBodyProps> = TMemo((props) => {
  const { converseUUID } = props;

  const writingList = useWritingState(converseUUID);

  return (
    <MsgContainerContextProvider>
      <ChatWritingIndicator list={writingList} />
      <ChatMsgList converseUUID={converseUUID} />
      <GroupMsgReply />
      <ChatSendBox converseUUID={converseUUID} />
    </MsgContainerContextProvider>
  );
});
ChatBody.displayName = 'ChatBody';
