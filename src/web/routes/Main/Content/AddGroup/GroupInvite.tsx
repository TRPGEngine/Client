import { TMemo } from '@shared/components/TMemo';
import { useCachedGroupInfo } from '@shared/hooks/useCache';
import { t } from '@shared/i18n';
import { showToasts } from '@shared/manager/ui';
import {
  agreeGroupInvite,
  getAllPendingInvites,
  GroupInviteInfo,
  refuseGroupInvite,
} from '@shared/model/group';
import Avatar from '@web/components/Avatar';
import { Loading } from '@web/components/Loading';
import { reportError } from '@web/utils/error';
import { Button, Empty, Space } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import styled from 'styled-components';

const GroupInviteItemContainer = styled.div`
  padding: 10px;
  display: flex;
`;

const GroupInviteItemName = styled.div`
  flex: 1;
  align-self: center;
  padding: 0 8px;
`;

const GroupInviteItem: React.FC<{
  invite: GroupInviteInfo;
  onRefetch: () => void;
}> = TMemo((props) => {
  const { invite, onRefetch } = props;
  const inviteUUID = invite.uuid;
  const groupInfo = useCachedGroupInfo(invite.group_uuid);

  const handleAgree = useCallback(async () => {
    try {
      await agreeGroupInvite(inviteUUID);
      onRefetch();
      showToasts(t('成功'));
    } catch (err) {
      showToasts(String(err), 'error');
      reportError(err);
    }
  }, [inviteUUID, onRefetch]);

  const handleRefuse = useCallback(async () => {
    try {
      await refuseGroupInvite(inviteUUID);
      onRefetch();
      showToasts(t('成功'));
    } catch (err) {
      showToasts(String(err), 'error');
      reportError(err);
    }
  }, [inviteUUID, onRefetch]);

  const { name, avatar } = groupInfo;

  return (
    <GroupInviteItemContainer>
      <Avatar name={name} src={avatar} />
      <GroupInviteItemName>{groupInfo.name}</GroupInviteItemName>
      <Space>
        <Button onClick={handleRefuse}>{t('拒绝')}</Button>
        <Button type="primary" onClick={handleAgree}>
          {t('同意')}
        </Button>
      </Space>
    </GroupInviteItemContainer>
  );
});
GroupInviteItem.displayName = 'GroupInviteItem';

export const GroupInvite = TMemo(() => {
  const [
    { value: groupInvites = [], loading },
    fetchGroupInvites,
  ] = useAsyncFn(() => {
    return getAllPendingInvites();
  }, []);

  useEffect(() => {
    fetchGroupInvites();
  }, []);

  if (loading === true) {
    return <Loading />;
  }

  if (groupInvites.length === 0) {
    return <Empty description={t('暂未接收到任何邀请')} />;
  }

  return (
    <div>
      {groupInvites.map((invite) => (
        <GroupInviteItem
          key={invite.uuid}
          invite={invite}
          onRefetch={fetchGroupInvites}
        />
      ))}
    </div>
  );
});
GroupInvite.displayName = 'GroupInvite';
