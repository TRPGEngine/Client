import React, { useMemo, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';
import { CloseCircleOutlined } from '@ant-design/icons';
import _isNil from 'lodash/isNil';
import { useUserName } from '@redux/hooks/useUser';

const Container = styled.div`
  position: relative;

  > div {
    position: absolute;
    height: 80px;
    width: 100%;
    background: white;
    padding: 8px 16px;
    bottom: 0;
    display: flex;
    border-top: 1px solid ${(props) => props.theme.color['bon-jour']};

    &::before {
      content: ' ';
      width: 3px;
      background-color: ${(props) => props.theme.color['dusty-gray']};
      position: absolute;
      left: 7px;
      top: 8px;
      bottom: 8px;
    }

    > div.reply-info {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;

      > div.reply-msg {
        text-overflow: ellipsis;
        overflow-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        display: -webkit-box;
      }
    }
  }
`;
export const GroupMsgReply: React.FC = TMemo(() => {
  const { replyMsg, clearReplyMsg } = useMsgContainerContext();
  const replyMsgSenderName = useUserName(replyMsg?.sender_uuid);

  const handleClose = useCallback(() => {
    clearReplyMsg();
  }, [clearReplyMsg]);
  const closeBtn = useMemo(() => {
    return <CloseCircleOutlined onClick={handleClose} />;
  }, [handleClose]);

  return (
    !_isNil(replyMsg) && (
      <Container>
        <div>
          <div className="reply-info">
            <div>回复 {replyMsgSenderName}:</div>
            <div title={replyMsg.message}>{replyMsg.message}</div>
          </div>
          {closeBtn}
        </div>
      </Container>
    )
  );
});
GroupMsgReply.displayName = 'GroupMsgReply';
