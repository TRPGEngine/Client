import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SectionHeader } from '@web/components/SectionHeader';
import { Menu } from 'antd';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import { useCurrentUserUUID } from '@redux/hooks/user';
import _isNil from 'lodash/isNil';
import { useGroupHeaderAction } from './useGroupHeaderAction';

interface GroupHeaderProps {
  groupUUID: string;
}
export const GroupHeader: React.FC<GroupHeaderProps> = TMemo((props) => {
  const { groupUUID } = props;
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const currentUserUUID = useCurrentUserUUID();

  const {
    handleShowGroupInfo,
    handleCreateGroupPanel,
    handleQuitGroup,
  } = useGroupHeaderAction(groupInfo!);

  if (_isNil(groupInfo)) {
    return null;
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={handleShowGroupInfo}>查看详情</Menu.Item>
      <Menu.Item>邀请成员</Menu.Item>
      <Menu.Item onClick={handleCreateGroupPanel}>创建面板</Menu.Item>
      <Menu.Item danger={true} onClick={handleQuitGroup}>
        {currentUserUUID === groupInfo.owner_uuid ? '解散团' : '退出团'}
      </Menu.Item>
    </Menu>
  );

  return <SectionHeader menu={menu}>{groupInfo?.name}</SectionHeader>;
});
GroupHeader.displayName = 'GroupHeader';
