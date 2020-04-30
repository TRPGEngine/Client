import React, { useState, useContext } from 'react';
import { MsgPayload } from '@redux/types/chat';
import { TMemo } from '@shared/components/TMemo';
import _noop from 'lodash/noop';
import _isNil from 'lodash/isNil';

/**
 * 该Context主要是为了让列表的操作与消息输入可以有一定关联性
 * 实现的功能:
 * - 回复
 */

type ReplyMsgType = Pick<MsgPayload, 'uuid' | 'message' | 'sender_uuid'>;
interface MsgContainerContextType {
  replyMsg: ReplyMsgType;
  setRelyMsg: (msg: ReplyMsgType) => void;
}

const MsgContainerContext = React.createContext<MsgContainerContextType>({
  replyMsg: null,
  setRelyMsg: _noop,
});

export const MsgContainerContextProvider: React.FC<{}> = TMemo((props) => {
  const [replyMsg, setRelyMsg] = useState<ReplyMsgType>(null);

  return (
    <MsgContainerContext.Provider value={{ replyMsg, setRelyMsg }}>
      {props.children}
    </MsgContainerContext.Provider>
  );
});
MsgContainerContextProvider.displayName = 'MsgContainerContextProvider';

export function useMsgContainerContext(): MsgContainerContextType & {
  hasContext: boolean;
} {
  const context = useContext(MsgContainerContext);

  return {
    hasContext: context.setRelyMsg !== _noop,
    replyMsg: context.replyMsg,
    setRelyMsg: context.setRelyMsg,
  };
}
