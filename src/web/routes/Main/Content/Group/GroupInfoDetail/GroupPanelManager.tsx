import React, { useState, useMemo, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import _isNil from 'lodash/isNil';
import { GroupPanel } from '@redux/types/group';
import { SortableList } from '@web/components/SortableList';
import { Button, Space, Typography } from 'antd';
import styled from 'styled-components';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { updatePanelOrder } from '@shared/model/panel';
import { showToasts } from '@shared/manager/ui';

const GroupPanelListItemContainer = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: move;

  .name {
    flex: 1;
    font-size: 18px;
  }
`;

const GroupPanelListItem: React.FC<{
  item: GroupPanel;
}> = TMemo((props) => {
  const { item } = props;

  const handleEdit = useCallback(() => {
    console.log('handleEdit');
  }, []);

  const handleRemove = useCallback(() => {
    console.log('handleRemove');
  }, []);

  return (
    <GroupPanelListItemContainer>
      <span className="name">{item.name}</span>
      <Space>
        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          编辑
        </Button>
        <Button danger={true} icon={<DeleteOutlined />} onClick={handleRemove}>
          移除
        </Button>
      </Space>
    </GroupPanelListItemContainer>
  );
});
GroupPanelListItem.displayName = 'GroupPanelListItem';

interface GroupPanelListProps {
  groupUUID: string;
  panels: GroupPanel[];
}
const GroupPanelList: React.FC<GroupPanelListProps> = TMemo((props) => {
  const { groupUUID } = props;
  const [panels, setPanels] = useState(props.panels);

  const isChanged = useMemo(() => {
    return (
      panels.map((p) => p.uuid).join(',') !==
      props.panels.map((p) => p.uuid).join(',')
    );
  }, [panels, props.panels]);

  // 保存
  const handleSave = useCallback(async () => {
    try {
      await updatePanelOrder(groupUUID, panels);
      showToasts('保存成功');
    } catch (err) {
      showToasts(err, 'error');
    }
  }, [groupUUID, panels]);

  // 重置
  const handleReset = useCallback(() => {
    setPanels(props.panels);
  }, [props.panels]);

  return (
    <div>
      <SortableList
        list={panels}
        itemKey="uuid"
        onChange={setPanels}
        renderItem={(item: GroupPanel) => <GroupPanelListItem item={item} />}
      />
      {isChanged && (
        <Space direction="horizontal">
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
      )}
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

    return (
      <div>
        <Typography.Title level={3}>面板({panels.length})</Typography.Title>

        <GroupPanelList groupUUID={groupInfo.uuid} panels={panels} />
      </div>
    );
  }
);
GroupPanelManager.displayName = 'GroupPanelManager';
