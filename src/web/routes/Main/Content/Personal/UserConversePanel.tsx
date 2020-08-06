import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';
import { ChatContainer } from '@web/components/chatBox/ChatContainer';

interface UserConversePanelParams {
  converseUUID: string;
}

export const UserConversePanel: React.FC = TMemo(() => {
  const params = useParams<UserConversePanelParams>();
  const converseUUID = params.converseUUID;

  return <ChatContainer converseUUID={converseUUID} />;
});
UserConversePanel.displayName = 'UserConversePanel';
