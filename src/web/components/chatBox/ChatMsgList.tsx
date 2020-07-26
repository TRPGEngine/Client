import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useMsgList } from '@redux/hooks/chat';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { shouleEmphasizeTime } from '@shared/utils/date-helper';
import { MessageItem } from '@shared/components/message/MessageItem';
import _get from 'lodash/get';
import styled from 'styled-components';

const Root = styled.div`
  padding: 0 10px;
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
`;

interface ChatMsgListProps {
  converseUUID: string;
}
export const ChatMsgList: React.FC<ChatMsgListProps> = TMemo((props) => {
  const { converseUUID } = props;
  const selfInfo = useCurrentUserInfo();
  const userUUID = selfInfo.uuid;
  const { list: msgList, nomore } = useMsgList(converseUUID);

  const msgListEl = useMemo(() => {
    return msgList.map((item, index) => {
      const arr = msgList;
      const prevDate = index > 0 ? _get(arr, [index - 1, 'date']) : 0;
      const date = item.date;
      const emphasizeTime = shouleEmphasizeTime(prevDate, date);

      return (
        <MessageItem
          key={item.uuid}
          data={item}
          emphasizeTime={emphasizeTime}
        />
      );
    });
  }, [msgList, selfInfo, userUUID]);

  return <Root>{msgListEl}</Root>;
});
ChatMsgList.displayName = 'ChatMsgList';
