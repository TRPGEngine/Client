import React, { useState, useContext, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import _noop from 'lodash/noop';
import _isNil from 'lodash/isNil';
import type { ReplyMsgType } from '@shared/utils/msg-helper';
import { ChatMsgTypeContextProvider } from './ChatMsgTypeContext';

/**
 * 该Context主要是为了让列表的操作与消息输入可以有一定关联性
 * 实现的功能:
 * - 回复
 */

interface MsgContainerContextType {
  replyMsg: ReplyMsgType | null;
  setReplyMsg: (msg: ReplyMsgType | null) => void;
  scrollToBottom: (() => void) | null;
  setScrollToBottom: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}

const MsgContainerContext = React.createContext<MsgContainerContextType>({
  replyMsg: null,
  setReplyMsg: _noop,
  scrollToBottom: null,
  setScrollToBottom: _noop,
});

export const MsgContainerContextProvider: React.FC<{}> = TMemo((props) => {
  const [replyMsg, setReplyMsg] = useState<ReplyMsgType | null>(null);
  const [scrollToBottom, setScrollToBottom] = useState<(() => void) | null>(
    null
  );

  return (
    <MsgContainerContext.Provider
      value={{
        replyMsg,
        setReplyMsg,
        scrollToBottom,
        setScrollToBottom,
      }}
    >
      <ChatMsgTypeContextProvider>{props.children}</ChatMsgTypeContextProvider>
    </MsgContainerContext.Provider>
  );
});
MsgContainerContextProvider.displayName = 'MsgContainerContextProvider';

export function useMsgContainerContext(): MsgContainerContextType & {
  hasContext: boolean;
  clearReplyMsg: () => void;
} {
  const context = useContext(MsgContainerContext);
  const clearReplyMsg = useCallback(() => {
    context.setReplyMsg(null);
  }, [context.setReplyMsg]);

  return {
    hasContext: context.setReplyMsg !== _noop,
    replyMsg: context.replyMsg,
    setReplyMsg: context.setReplyMsg,
    clearReplyMsg,
    scrollToBottom: context.scrollToBottom,
    setScrollToBottom: context.setScrollToBottom,
  };
}
