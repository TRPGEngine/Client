import { RenderMsgPayload } from '@redux/types/chat';
import { TMemo } from '@shared/components/TMemo';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';
import React, { useCallback, useMemo, useContext } from 'react';
import { MsgOperationListItemContainer, MsgModelContext } from './MsgModal';

export const DefaultMsgReply: React.FC<{
  payload: RenderMsgPayload;
}> = TMemo((props) => {
  const { hasContext, setReplyMsg } = useMsgContainerContext(); // 仅当有上下文的时候才会渲染回复按钮
  const { closeMsgModal } = useContext(MsgModelContext);

  const handlePress = useCallback(() => {
    setReplyMsg(props.payload);
    closeMsgModal();
  }, [props.payload, setReplyMsg, closeMsgModal]);

  return useMemo(
    () =>
      hasContext && (
        <MsgOperationListItemContainer onPress={handlePress}>
          回复
        </MsgOperationListItemContainer>
      ),
    [hasContext, handlePress]
  );
});
DefaultMsgReply.displayName = 'DefaultMsgReply';
