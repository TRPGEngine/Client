import type { MsgType } from '@redux/types/chat';
import type { TRPGEditor } from '@web/components/editor/types';
import React, { useContext } from 'react';

interface ChatSendBoxContextProps {
  editorRef: React.MutableRefObject<TRPGEditor | undefined>;
  editorEl: React.ReactNode;
  sendMsg: (message: string, type: MsgType) => void;
}
export const ChatSendBoxContext =
  React.createContext<ChatSendBoxContextProps | null>(null);

export function useChatSendBoxContext() {
  return useContext(ChatSendBoxContext);
}
