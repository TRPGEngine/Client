import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SectionHeader } from '@web/components/SectionHeader';
import { Menu } from 'antd';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useCurrentUserUUID } from '@redux/hooks/user';
import _isNil from 'lodash/isNil';
import { showAlert } from '@redux/actions/ui';
import { dismissGroup, quitGroup } from '@redux/actions/group';
import { showToasts } from '@shared/manager/ui';
import { useGroupHeaderAction } from './useGroupHeaderAction';

interface GroupHeaderProps {
  groupUUID: string;
}
export const GroupHeader: React.FC<GroupHeaderProps> = TMemo((props) => {
  const { groupUUID } = props;
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const currentUserUUID = useCurrentUserUUID();

  const { handleShowGroupInfo, handleQuitGroup } = useGroupHeaderAction(
    groupInfo!
  );

  if (_isNil(groupInfo)) {
    return null;
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={handleShowGroupInfo}>查看详情</Menu.Item>
      <Menu.Item>邀请成员</Menu.Item>
      <Menu.Item>创建面板</Menu.Item>
      <Menu.Item danger={true} onClick={handleQuitGroup}>
        {currentUserUUID === groupInfo.owner_uuid ? '解散团' : '退出团'}
      </Menu.Item>
    </Menu>
  );

  return <SectionHeader menu={menu}>{groupInfo?.name}</SectionHeader>;
});
GroupHeader.displayName = 'GroupHeader';
