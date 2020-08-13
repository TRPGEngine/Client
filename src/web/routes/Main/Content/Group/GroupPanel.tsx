import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';
import { ChatContainer } from '@web/components/chatBox/ChatContainer';
import { Result } from 'antd';

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

  return (
    <div>
      <Result status="warning" title="找不到该面板" />
    </div>
  );
});
GroupPanel.displayName = 'GroupPanel';
