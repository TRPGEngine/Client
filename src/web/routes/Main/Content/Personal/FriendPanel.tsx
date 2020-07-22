import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { Tabs, Badge } from 'antd';
import { UserListItem } from '@web/components/UserListItem';
import { SectionTabs } from '@web/components/SectionTabs';
const { TabPane } = Tabs;

export const FriendPanel: React.FC = TMemo(() => {
  const friendList = useTRPGSelector((state) => state.user.friendList);
  const friendInvite = useTRPGSelector((state) => state.user.friendInvite);
  const friendRequests = useTRPGSelector((state) => state.user.friendRequests);

  return (
    <SectionTabs defaultActiveKey="1">
      <TabPane tab="全部" key="1">
        {friendList.map((uuid) => (
          <UserListItem key={uuid} userUUID={uuid} />
        ))}
      </TabPane>
      <TabPane
        tab={
          <Badge count={friendInvite.length}>
            <span>好友邀请</span>
          </Badge>
        }
        key="2"
      >
        {JSON.stringify(friendInvite)}
      </TabPane>
      <TabPane
        tab={
          <Badge count={friendRequests.length}>
            <span>好友请求</span>
          </Badge>
        }
        key="3"
      >
        {JSON.stringify(friendRequests)}
      </TabPane>
    </SectionTabs>
  );
});
FriendPanel.displayName = 'FriendPanel';
