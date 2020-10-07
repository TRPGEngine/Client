import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { MsgContainerContextProvider } from '@shared/context/MsgContainerContext';
import { ChatMsgList } from './ChatMsgList';
import { ChatSendBox } from './ChatSendBox';
import { useWritingState } from '@redux/hooks/chat';
import { ChatWritingIndicator } from '../ChatWritingIndicator';
import { ChatMsgReply } from './ChatMsgReply';

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
      <ChatMsgReply />
      <ChatSendBox converseUUID={converseUUID} />
    </MsgContainerContextProvider>
  );
});
ChatBody.displayName = 'ChatBody';
