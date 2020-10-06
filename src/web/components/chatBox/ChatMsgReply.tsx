import React, { useMemo, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';
import { CloseCircleOutlined } from '@ant-design/icons';
import _isNil from 'lodash/isNil';
import { useUserName } from '@redux/hooks/user';
import { useTranslation } from '@shared/i18n';

const Container = styled.div`
  position: relative;
  width: 100%;

  > div {
    position: absolute;
    height: 80px;
    color: white;
    background-color: ${(props) => props.theme.color.transparent50};
    padding: 8px 16px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    border-radius: 10px;
    margin: 10px 16px;

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
export const ChatMsgReply: React.FC = TMemo(() => {
  const { replyMsg, clearReplyMsg } = useMsgContainerContext();
  const replyMsgSenderName = useUserName(replyMsg?.sender_uuid!);
  const { t } = useTranslation();

  const handleClose = useCallback(() => {
    clearReplyMsg();
  }, [clearReplyMsg]);
  const closeBtn = useMemo(() => {
    return <CloseCircleOutlined onClick={handleClose} />;
  }, [handleClose]);

  return !_isNil(replyMsg) ? (
    <Container>
      <div>
        <div className="reply-info">
          <div>
            {t('回复')} {replyMsgSenderName}:
          </div>
          <div title={replyMsg.message}>{replyMsg.message}</div>
        </div>
        {closeBtn}
      </div>
    </Container>
  ) : null;
});
ChatMsgReply.displayName = 'ChatMsgReply';
