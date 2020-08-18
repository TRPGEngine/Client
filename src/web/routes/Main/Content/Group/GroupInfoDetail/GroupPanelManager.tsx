import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import _isNil from 'lodash/isNil';

interface GroupPanelManagerProps {
  groupUUID: string;
}
export const GroupPanelManager: React.FC<GroupPanelManagerProps> = TMemo(
  (props) => {
    const groupInfo = useJoinedGroupInfo(props.groupUUID);

    if (_isNil(groupInfo)) {
      return null;
    }

    const panels = groupInfo.panels ?? [];

    // TODO
    return <div>{JSON.stringify(panels)}</div>;
  }
);
GroupPanelManager.displayName = 'GroupPanelManager';
