import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';
import { ChatContainer } from '@web/components/chatBox/ChatContainer';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface UserConversePanelParams {
  converseUUID: string;
}

export const UserConversePanel: React.FC = TMemo(() => {
  const params = useParams<UserConversePanelParams>();
  const converseUUID = params.converseUUID;

  return (
    <Root>
      <ChatContainer converseType="user" converseUUID={converseUUID} />
    </Root>
  );
});
UserConversePanel.displayName = 'UserConversePanel';
