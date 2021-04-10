import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Space, Typography } from 'antd';
import { useTranslation } from '@shared/i18n';
import {
  useIsGroupManager,
  useJoinedGroupInfo,
  useIsGroupOwner,
} from '@redux/hooks/group';
import styled from 'styled-components';
import { useCachedUserInfo } from '@redux/hooks/useCache';
import { getUserName } from '@shared/utils/data-helper';
import { useCurrentUserUUID } from '@redux/hooks/user';
import {
  setMemberToManager,
  tickMember,
  setManagerToMember,
} from '@shared/model/group';
import { showAlert, showToasts } from '@shared/manager/ui';
import { UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';
import { PillTabs } from '@web/components/PillTabs';
import { GroupRequestList } from './GroupRequestList';

const { TabPane } = PillTabs;

const GroupMemberItemContainer = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
`;

const GroupMemberItemUserName = styled.div`
  flex: 1;
`;

const GroupMemberItem: React.FC<{
  groupUUID: string;
  userUUID: string;
}> = TMemo((props) => {
  const { groupUUID, userUUID } = props;
  const userInfo = useCachedUserInfo(userUUID);
  const { t } = useTranslation();
  const currentUserUUID = useCurrentUserUUID();
  const isGroupManager = useIsGroupManager(groupUUID, userUUID);
  const isGroupOwner = useIsGroupOwner(groupUUID, currentUserUUID);

  const handleRaiseManager = useCallback(() => {
    showAlert({
      message: t('确定要将用户提升为管理员么?'),
      onConfirm: async () => {
        try {
          await setMemberToManager(groupUUID, userUUID);
        } catch (err) {
          showToasts(String(err), 'error');
        }
      },
    });
  }, [groupUUID, userUUID]);

  const handleDownManager = useCallback(() => {
    showAlert({
      message: t('确定要将管理员降级为普通用户么?'),
      onConfirm: async () => {
        try {
          await setManagerToMember(groupUUID, userUUID);
        } catch (err) {
          showToasts(String(err), 'error');
        }
      },
    });
  }, [groupUUID, userUUID]);

  const handleTickMember = useCallback(() => {
    showAlert({
      message: t('确定要踢出用户么?'),
      onConfirm: async () => {
        try {
          await tickMember(groupUUID, userUUID);
        } catch (err) {
          showToasts(String(err), 'error');
        }
      },
    });
  }, [groupUUID, userUUID]);

  return (
    <GroupMemberItemContainer>
      <GroupMemberItemUserName>{getUserName(userInfo)}</GroupMemberItemUserName>

      {currentUserUUID === userUUID ? (
        <div>{t('你自己')}</div>
      ) : (
        <Space>
          {isGroupOwner === true &&
            (!isGroupManager ? (
              <Button icon={<UpSquareOutlined />} onClick={handleRaiseManager}>
                {t('升为管理')}
              </Button>
            ) : (
              <Button icon={<DownSquareOutlined />} onClick={handleDownManager}>
                {t('降为成员')}
              </Button>
            ))}
          <Button danger={true} onClick={handleTickMember}>
            {t('踢出团')}
          </Button>
        </Space>
      )}
    </GroupMemberItemContainer>
  );
});

interface GroupMemberManageProps {
  groupUUID: string;
}
export const GroupMemberManage: React.FC<GroupMemberManageProps> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const groupInfo = useJoinedGroupInfo(groupUUID);
    const memberUUIDs = groupInfo?.group_members ?? [];
    const { t } = useTranslation();

    return (
      <div>
        <Typography.Title level={3}>
          {t('成员管理')}({memberUUIDs.length})
        </Typography.Title>

        <PillTabs defaultActiveKey="1">
          <TabPane tab={t('当前')} key="1">
            {memberUUIDs.map((uuid) => (
              <GroupMemberItem
                key={uuid}
                groupUUID={groupUUID}
                userUUID={uuid}
              />
            ))}
          </TabPane>

          <TabPane tab={t('请求加入')} key="2">
            <GroupRequestList groupUUID={groupUUID} />
          </TabPane>
        </PillTabs>
      </div>
    );
  }
);
GroupMemberManage.displayName = 'GroupMemberManage';
