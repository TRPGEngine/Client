import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';
import { Result } from 'antd';
import { GroupChatPanel } from './GroupPanel/GroupChatPanel';

interface GroupPanelParams {
  groupUUID: string;
  panelUUID: string;
}

export const GroupPanel: React.FC = TMemo(() => {
  const params = useParams<GroupPanelParams>();
  const { groupUUID, panelUUID } = params;

  if (panelUUID === 'main') {
    return <GroupChatPanel groupUUID={groupUUID} />;
  }

  return (
    <div>
      <Result status="warning" title="找不到该面板" />
    </div>
  );
});
GroupPanel.displayName = 'GroupPanel';
