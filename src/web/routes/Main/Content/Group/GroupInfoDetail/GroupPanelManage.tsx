import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import _isNil from 'lodash/isNil';
import { GroupPanel } from '@redux/types/group';
import { SortableList } from '@web/components/SortableList';
import { Button, Space, Typography } from 'antd';
import styled from 'styled-components';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { updatePanelOrder, removePanel } from '@shared/model/panel';
import { showToasts, showAlert } from '@shared/manager/ui';
import { openModal, ModalWrapper } from '@web/components/Modal';
import { GroupPanelUpdateInfo } from '@web/components/modal/GroupPanelUpdateInfo';
import { useTranslation } from '@shared/i18n';

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
  groupUUID: string;
  item: GroupPanel;
}> = TMemo((props) => {
  const { groupUUID, item } = props;
  const panelUUID = item.uuid;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleEdit = useCallback(() => {
    openModal(
      <ModalWrapper>
        <GroupPanelUpdateInfo groupUUID={groupUUID} panelUUID={item.uuid} />
      </ModalWrapper>
    );
  }, [groupUUID, item.uuid]);

  const handleRemove = useCallback(() => {
    showAlert({
      message: '确认要移除么？移除后数据无法找回',
      onConfirm: async () => {
        setLoading(true);
        await removePanel(groupUUID, panelUUID);
        setLoading(false);
      },
    });
  }, [groupUUID, panelUUID]);

  return (
    <GroupPanelListItemContainer>
      <span className="name">{item.name}</span>
      <Space>
        <Button
          type="primary"
          icon={<EditOutlined />}
          loading={loading}
          onClick={handleEdit}
        >
          {t('编辑')}
        </Button>
        <Button
          danger={true}
          icon={<DeleteOutlined />}
          loading={loading}
          onClick={handleRemove}
        >
          {t('移除')}
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
  const { t } = useTranslation();

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
      showToasts(t('保存成功'));
    } catch (err) {
      showToasts(err, 'error');
    }
  }, [groupUUID, panels]);

  // 重置
  const handleReset = useCallback(() => {
    setPanels(props.panels);
  }, [props.panels]);

  useEffect(() => {
    setPanels(props.panels); // 总状态更新时强制更新内部状态
  }, [props.panels]);

  return (
    <div>
      <SortableList
        list={panels}
        itemKey="uuid"
        onChange={setPanels}
        renderItem={(item: GroupPanel) => (
          <GroupPanelListItem groupUUID={groupUUID} item={item} />
        )}
      />
      {isChanged && (
        <Space direction="horizontal">
          <Button type="primary" onClick={handleSave}>
            {t('保存')}
          </Button>
          <Button onClick={handleReset}>{t('重置')}</Button>
        </Space>
      )}
    </div>
  );
});
GroupPanelList.displayName = 'GroupPanelList';

interface GroupPanelManageProps {
  groupUUID: string;
}
export const GroupPanelManage: React.FC<GroupPanelManageProps> = TMemo(
  (props) => {
    const groupInfo = useJoinedGroupInfo(props.groupUUID);
    const { t } = useTranslation();

    if (_isNil(groupInfo)) {
      return null;
    }

    const panels = groupInfo.panels ?? [];

    return (
      <div>
        <Typography.Title level={3}>
          {t('面板')}({panels.length})
        </Typography.Title>

        <GroupPanelList groupUUID={groupInfo.uuid} panels={panels} />
      </div>
    );
  }
);
GroupPanelManage.displayName = 'GroupPanelManage';
