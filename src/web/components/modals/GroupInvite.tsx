import React, { useCallback, useMemo, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { UserUUIDSelector } from '../UserUUIDSelector';
import { useTRPGDispatch, useTRPGSelector } from '@redux/hooks/useTRPGSelector';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import { useCurrentUserUUID } from '@redux/hooks/user';
import { Button, Col, Divider, Row, Typography } from 'antd';
import { useAsyncFn } from 'react-use';
import { showToasts } from '@shared/manager/ui';
import { createGroupInviteCode } from '@shared/model/group';
import config from '@shared/project.config';
import { closeModal, ModalWrapper } from '../Modal';
import { sendGroupInvite } from '@redux/actions/group';
import { useTranslation } from '@shared/i18n';

/**
 * 获取团邀请可用的所有用户UUID
 * @param groupUUID 团UUID
 */
function useGroupInviteAllUserUUIDs(groupUUID: string): string[] {
  const currentUserUUID = useCurrentUserUUID();
  const groupInfo = useJoinedGroupInfo(groupUUID);

  const excludeUUIDs = useMemo(() => {
    const list = _isString(currentUserUUID) ? [currentUserUUID] : [];
    if (!_isNil(groupInfo) && Array.isArray(groupInfo.group_members)) {
      list.push(...groupInfo.group_members);
    }
    return list;
  }, [currentUserUUID, groupInfo?.group_members]);
  const friends = useTRPGSelector<string[]>((state) => state.user.friendList);

  return useMemo(() => friends.filter((uuid) => !excludeUUIDs.includes(uuid)), [
    friends,
    excludeUUIDs,
  ]);
}

interface GroupInviteProps {
  groupUUID: string;
}
export const GroupInvite: React.FC<GroupInviteProps> = TMemo((props) => {
  const { groupUUID } = props;
  const [uuids, setUUIDs] = useState<string[]>([]);
  const allUserUUIDs = useGroupInviteAllUserUUIDs(groupUUID);
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();

  const handleSendInvite = useCallback(() => {
    uuids.forEach((uuid) => {
      dispatch(sendGroupInvite(groupUUID, uuid));
    });
    closeModal();
  }, [uuids]);

  const [
    { loading: inviteCodeLoading, value: inviteCode },
    handleCreateInviteCode,
  ] = useAsyncFn(async () => {
    try {
      const invite = await createGroupInviteCode(groupUUID);
      return invite;
    } catch (err) {
      showToasts(err, 'error');
    }
  }, [groupUUID]);

  return (
    <ModalWrapper title={t('邀请好友')}>
      <div>{t('从好友中选择')}</div>
      <Row>
        <Col xs={24} sm={16}>
          <UserUUIDSelector
            allUserUUIDs={allUserUUIDs}
            value={uuids}
            onChange={setUUIDs}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Button onClick={handleSendInvite}>{t('发送邀请')}</Button>
        </Col>
      </Row>

      <Divider />

      <div>{t('或')}</div>
      <div>
        {_isNil(inviteCode) ? (
          <Button loading={inviteCodeLoading} onClick={handleCreateInviteCode}>
            {t('创建邀请码')}
          </Button>
        ) : (
          <Typography.Paragraph
            copyable={{
              text: config.url.getInviteUrl(inviteCode.code),
              onCopy: () => showToasts(t('复制成功, 直接发送给好友让他加入吧')),
              tooltips: t('复制邀请链接'),
            }}
          >
            {t('无限制邀请码')}: {inviteCode.code}
          </Typography.Paragraph>
        )}
      </div>
    </ModalWrapper>
  );
});
GroupInvite.displayName = 'GroupInvite';
