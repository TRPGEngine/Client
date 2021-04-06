import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useTranslation } from '@shared/i18n';
import {
  useGroupManagerUUIDs,
  useJoinedGroupInfo,
  useGroupNormalMembers,
} from '@redux/hooks/group';
import _isNil from 'lodash/isNil';
import _without from 'lodash/without';
import { TPopover } from '@web/components/popover';
import PopoverUserInfo from '@web/components/popover/UserInfo';
import { UserListItem } from '@web/components/UserListItem';
import styled from 'styled-components';

const TipText = styled.div`
  color: ${(props) => props.theme.color['dusty-gray']};
  text-align: center;
`;

function renderMemberList(uuids: string[], emptyText: string = '') {
  if (!Array.isArray(uuids) || uuids.length === 0) {
    return <TipText>{emptyText}</TipText>;
  }

  return uuids.map((uuid) => (
    <TPopover
      key={uuid}
      placement="left"
      trigger="click"
      content={<PopoverUserInfo userUUID={uuid} />}
    >
      <div>
        <UserListItem userUUID={uuid} />
      </div>
    </TPopover>
  ));
}

interface GroupMembersProps {
  groupUUID: string;
}
export const GroupMembers: React.FC<GroupMembersProps> = TMemo((props) => {
  const { groupUUID } = props;
  const { t } = useTranslation();
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const allManagers = useGroupManagerUUIDs(groupUUID);
  const normalMembers = useGroupNormalMembers(groupUUID);
  const filterManagers = _without<string>(
    allManagers,
    groupInfo?.owner_uuid ?? ''
  );

  if (_isNil(groupInfo)) {
    return null;
  }

  return (
    <div>
      <div>{t('拥有者')}</div>
      {renderMemberList([groupInfo.owner_uuid])}
      <div>{t('主持人')}</div>
      {renderMemberList(filterManagers, t('暂无其他主持人'))}
      <div>{t('成员')}</div>
      {renderMemberList(normalMembers, t('暂无其他成员'))}
    </div>
  );
});
GroupMembers.displayName = 'GroupMembers';
