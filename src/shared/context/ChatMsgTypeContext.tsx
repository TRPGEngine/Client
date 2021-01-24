import React, { useContext, useState } from 'react';
import type { MsgType } from '@redux/types/chat';
import { TMemo } from '@shared/components/TMemo';

const ChatMsgTypeContext = React.createContext<{
  msgType: MsgType;
  setMsgType: (newType: MsgType) => void;
}>({
  msgType: 'normal',
  setMsgType: () => {},
});
ChatMsgTypeContext.displayName = 'ChatMsgTypeContext';

export const ChatMsgTypeContextProvider: React.FC = TMemo((props) => {
  const [msgType, setMsgType] = useState<MsgType>('normal');
  return (
    <ChatMsgTypeContext.Provider value={{ msgType, setMsgType }}>
      {props.children}
    </ChatMsgTypeContext.Provider>
  );
});
ChatMsgTypeContextProvider.displayName = 'ChatMsgTypeContextProvider';

export function useChatMsgTypeContext() {
  const { msgType, setMsgType } = useContext(ChatMsgTypeContext);

  return { msgType, setMsgType };
}
