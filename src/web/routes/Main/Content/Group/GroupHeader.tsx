import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SectionHeader } from '@web/components/SectionHeader';
import { Menu } from 'antd';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';

interface GroupHeaderProps {
  groupUUID: string;
}
export const GroupHeader: React.FC<GroupHeaderProps> = TMemo((props) => {
  const { groupUUID } = props;
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const dispatch = useTRPGDispatch();

  const handleGroupInfo = useCallback(() => {
    console.log('TODO');
  }, []);

  const menu = (
    <Menu>
      <Menu.Item onClick={handleGroupInfo}>查看详情</Menu.Item>
      <Menu.Item>邀请成员</Menu.Item>
      <Menu.Item>创建面板</Menu.Item>
      <Menu.Item danger={true}>退出团</Menu.Item>
    </Menu>
  );

  return <SectionHeader menu={menu}>{groupInfo?.name}</SectionHeader>;
});
GroupHeader.displayName = 'GroupHeader';
