import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';
import { ChatContainer } from '@web/components/chatBox/ChatContainer';

interface GroupPanelParams {
  groupUUID: string;
  panelUUID: string;
}

export const GroupPanel: React.FC = TMemo(() => {
  const params = useParams<GroupPanelParams>();
  const { groupUUID, panelUUID } = params;

  if (panelUUID === 'main') {
    return <ChatContainer converseUUID={groupUUID} />;
  }

  return <div>{JSON.stringify(params)}</div>;
});
GroupPanel.displayName = 'GroupPanel';
