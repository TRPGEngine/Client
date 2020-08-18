import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatHeader } from './ChatHeader';
import { ChatMsgList } from './ChatMsgList';
import styled from 'styled-components';
import { ChatSendBox } from './ChatSendBox';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
`;

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: auto;
`;

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatRightPanel = styled.div`
  width: ${(props) => props.theme.style.sidebarWidth};
  background-color: ${(props) => props.theme.style.sidebarBackgroundColor};
  padding: 8px;
`;

interface Props {
  converseUUID: string;
  style?: React.CSSProperties;
  headerActions?: React.ReactNode[];
  rightPanel?: React.ReactNode;
}
export const ChatContainer: React.FC<Props> = TMemo((props) => {
  const { converseUUID, style, headerActions, rightPanel } = props;

  return (
    <Root style={style}>
      <ChatHeader converseUUID={converseUUID} headerActions={headerActions} />
      <ChatMain>
        <ChatContent>
          <ChatMsgList converseUUID={converseUUID} />
          <ChatSendBox converseUUID={converseUUID} />
        </ChatContent>

        {rightPanel && <ChatRightPanel>{rightPanel}</ChatRightPanel>}
      </ChatMain>
    </Root>
  );
});
ChatContainer.displayName = 'ChatContainer';
