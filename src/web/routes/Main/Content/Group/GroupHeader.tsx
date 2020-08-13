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

interface GroupHeaderProps {
  groupUUID: string;
}
export const GroupHeader: React.FC<GroupHeaderProps> = TMemo((props) => {
  const { groupUUID } = props;
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const currentUserUUID = useCurrentUserUUID();
  const dispatch = useTRPGDispatch();

  const handleShowGroupInfo = useCallback(() => {
    console.log('TODO');
  }, []);

  // 解散/退出团
  const handleQuitGroup = useCallback(() => {
    if (_isNil(groupInfo)) {
      showToasts('找不到该团');
      return;
    }

    const groupUUID = groupInfo.uuid;
    if (currentUserUUID === groupInfo.owner_uuid) {
      // 解散团
      dispatch(
        showAlert({
          title: '是否要解散群',
          content: '一旦确定无法撤销',
          onConfirm: () => {
            dispatch(dismissGroup(groupUUID));
          },
        })
      );
    } else {
      dispatch(
        showAlert({
          title: '是否要退出群',
          content: '一旦确定无法撤销',
          onConfirm: () => {
            dispatch(quitGroup(groupUUID));
          },
        })
      );
    }
  }, [currentUserUUID, groupInfo?.owner_uuid, groupInfo?.uuid]);

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
