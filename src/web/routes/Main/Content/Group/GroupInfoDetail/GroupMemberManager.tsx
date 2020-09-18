import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Space, Typography } from 'antd';
import { useTranslation } from '@shared/i18n';
import { useIsGroupManager, useJoinedGroupInfo } from '@redux/hooks/group';
import styled from 'styled-components';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import { getUserName } from '@shared/utils/data-helper';
import { useCurrentUserUUID } from '@redux/hooks/user';
import { setMemberToManager, tickMember } from '@shared/model/group';
import { showAlert, showToasts } from '@shared/manager/ui';

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

  const handleRaiseManager = useCallback(() => {
    showAlert({
      message: '确定要将用户提升为管理员么?',
      onConfirm: async () => {
        try {
          await setMemberToManager(groupUUID, userUUID);
        } catch (err) {
          showToasts(String(err), 'error');
        }
      },
    });
  }, [groupUUID, userUUID]);

  const handleTickMember = useCallback(() => {
    showAlert({
      message: '确定要踢出用户么?',
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
        <div>你自己</div>
      ) : (
        <Space>
          {!isGroupManager && (
            <Button onClick={handleRaiseManager}>{t('升为管理')}</Button>
          )}
          <Button danger={true} onClick={handleTickMember}>
            {t('踢出团')}
          </Button>
        </Space>
      )}
    </GroupMemberItemContainer>
  );
});

interface GroupMemberManagerProps {
  groupUUID: string;
}
export const GroupMemberManager: React.FC<GroupMemberManagerProps> = TMemo(
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

        {memberUUIDs.map((uuid) => (
          <GroupMemberItem key={uuid} groupUUID={groupUUID} userUUID={uuid} />
        ))}
      </div>
    );
  }
);
GroupMemberManager.displayName = 'GroupMemberManager';
