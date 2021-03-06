import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import _get from 'lodash/get';
import _last from 'lodash/last';
import _head from 'lodash/head';
import styled from 'styled-components';
import { useChatMsgList } from './useChatMsgList';
import { Button } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';

const Root = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
`;

const Container = styled.div`
  height: 100%;
  padding: 0 10px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const ScrollToBottomBtn = styled(Button)<{
  isShow: boolean;
}>`
  position: absolute !important;
  bottom: 20px;
  right: 30px;
  box-shadow: ${({ theme }) => theme.boxShadow.elevationMedium} !important;
  opacity: ${({ isShow }) => (isShow ? 1 : 0)};
  transition-property: opacity;
  transition-delay: 0.4s;
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
    isTriggerBottom,
    handleScrollToBottom,
  } = useChatMsgList(converseUUID);

  return (
    <Root>
      <Container
        ref={containerRef}
        onWheel={handleWheel}
        onScroll={handleWheel}
        onTouchEnd={handleWheel}
        onLoad={handleListLoad}
      >
        {loadMoreEl}
        {msgListEl}
      </Container>

      <ScrollToBottomBtn
        isShow={!isTriggerBottom}
        size="large"
        type="primary"
        shape="circle"
        icon={<ArrowDownOutlined />}
        onClick={handleScrollToBottom}
      />
    </Root>
  );
});
ChatMsgList.displayName = 'ChatMsgList';
