import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { Tabs, Badge, Tooltip, Button } from 'antd';
import { UserListItem } from '@web/components/UserListItem';
import { SectionTabs } from '@web/components/SectionTabs';
import styled from 'styled-components';
import { MessageOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

const PaneContainer = styled.div`
  padding: 10px 20px;
`;

export const FriendPanel: React.FC = TMemo(() => {
  const friendList = useTRPGSelector((state) => state.user.friendList);
  const friendInvite = useTRPGSelector((state) => state.user.friendInvite);
  const friendRequests = useTRPGSelector((state) => state.user.friendRequests);

  return (
    <SectionTabs defaultActiveKey="1">
      <TabPane tab="全部" key="1">
        <PaneContainer>
          {friendList.map((uuid) => (
            <UserListItem
              key={uuid}
              userUUID={uuid}
              actions={[
                <Tooltip title="发送消息" key="sendMsg">
                  <Button shape="circle" icon={<MessageOutlined />} />
                </Tooltip>,
              ]}
            />
          ))}
        </PaneContainer>
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
        {friendRequests
          .filter((req) => req.is_agree === false && req.is_refuse === false)
          .map((request) => (
            <UserListItem
              key={request.uuid}
              userUUID={request.from_uuid}
              actions={[
                <Button key="refuse" danger={true} type="primary">
                  拒绝
                </Button>,
                <Button key="agree" type="primary">
                  同意
                </Button>,
              ]}
            />
          ))}
      </TabPane>
    </SectionTabs>
  );
});
FriendPanel.displayName = 'FriendPanel';
