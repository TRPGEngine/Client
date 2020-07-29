import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';

interface GroupPanelParams {
  groupUUID: string;
  panelUUID: string;
}

export const GroupPanel: React.FC = TMemo(() => {
  const params = useParams<GroupPanelParams>();

  return <div>{JSON.stringify(params)}</div>;
});
GroupPanel.displayName = 'GroupPanel';
