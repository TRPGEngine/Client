import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatHeader } from './ChatHeader';
import { ChatMsgList } from './ChatMsgList';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface Props {
  converseUUID: string;
}
export const ChatContainer: React.FC<Props> = TMemo((props) => {
  const { converseUUID } = props;

  return (
    <Root>
      <ChatHeader converseUUID={converseUUID} />
      <ChatMsgList converseUUID={converseUUID} />
    </Root>
  );
});
ChatContainer.displayName = 'ChatContainer';
