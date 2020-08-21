import React, { useState, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import _isNil from 'lodash/isNil';
import { GroupPanel } from '@redux/types/group';
import { SortableList } from '@web/components/SortableList';
import { Button } from 'antd';

interface GroupPanelListProps {
  panels: GroupPanel[];
}
const GroupPanelList: React.FC<GroupPanelListProps> = TMemo((props) => {
  const [panels, setPanels] = useState(props.panels);

  const isChanged = useMemo(() => {
    return (
      panels.map((p) => p.uuid).join(',') !==
      props.panels.map((p) => p.uuid).join(',')
    );
  }, [panels, props.panels]);

  return (
    <div>
      <SortableList
        list={panels}
        itemKey="uuid"
        onChange={setPanels}
        renderItem={(item: GroupPanel) => <div>{item.name}</div>}
      />
      {isChanged && <Button type="primary">保存</Button>}
    </div>
  );
});
GroupPanelList.displayName = 'GroupPanelList';

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

    return <GroupPanelList panels={panels} />;
  }
);
GroupPanelManager.displayName = 'GroupPanelManager';
