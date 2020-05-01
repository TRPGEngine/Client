import React, { useState, useContext, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import _noop from 'lodash/noop';
import _isNil from 'lodash/isNil';
import { ReplyMsgType } from '@shared/utils/msg-helper';

/**
 * 该Context主要是为了让列表的操作与消息输入可以有一定关联性
 * 实现的功能:
 * - 回复
 */

interface MsgContainerContextType {
  replyMsg: ReplyMsgType;
  setReplyMsg: (msg: ReplyMsgType) => void;
}

const MsgContainerContext = React.createContext<MsgContainerContextType>({
  replyMsg: null,
  setReplyMsg: _noop,
});

export const MsgContainerContextProvider: React.FC<{}> = TMemo((props) => {
  const [replyMsg, setReplyMsg] = useState<ReplyMsgType>(null);

  return (
    <MsgContainerContext.Provider value={{ replyMsg, setReplyMsg }}>
      {props.children}
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
  };
}
