import React, { useMemo, useEffect, useRef } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useMsgList } from '@redux/hooks/chat';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { shouleEmphasizeTime } from '@shared/utils/date-helper';
import { MessageItem } from '@shared/components/message/MessageItem';
import _get from 'lodash/get';
import _last from 'lodash/last';
import styled from 'styled-components';
import { scrollToBottom } from '@shared/utils/animated-scroll-to';

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
  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    // 元素更新时滚动到底部
    if (containerRef.current) {
      scrollToBottom(containerRef.current, 100);
    }
  }, [_last(msgList)]);

  return <Root ref={containerRef}>{msgListEl}</Root>;
});
ChatMsgList.displayName = 'ChatMsgList';
