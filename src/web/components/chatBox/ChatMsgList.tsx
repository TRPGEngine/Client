import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import _get from 'lodash/get';
import _last from 'lodash/last';
import _head from 'lodash/head';
import styled from 'styled-components';
import { useChatMsgList } from './useChatMsgList';

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

  const {
    containerRef,
    msgListEl,
    loadMoreEl,
    handleWheel,
    handleListLoad,
  } = useChatMsgList(converseUUID);

  return (
    <Root ref={containerRef} onWheel={handleWheel} onLoad={handleListLoad}>
      {loadMoreEl}
      {msgListEl}
    </Root>
  );
});
ChatMsgList.displayName = 'ChatMsgList';
