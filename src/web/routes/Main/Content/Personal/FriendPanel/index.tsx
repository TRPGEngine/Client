import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { Tabs, Badge, Tooltip, Button, Typography } from 'antd';
import { UserListItem } from '@web/components/UserListItem';
import { SectionTabs } from '@web/components/SectionTabs';
import styled from 'styled-components';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { AddFriend } from './AddFriend';
const { TabPane } = Tabs;

const PaneContainer = styled.div`
  padding: 10px 20px;
`;

const AddFriendTabLabel = styled.div`
  color: ${(props) => props.theme.color.downy};
`;

export const FriendPanel: React.FC = TMemo(() => {
  const friendList = useTRPGSelector((state) => state.user.friendList);
  const friendInvite = useTRPGSelector((state) => state.user.friendInvite);
  const friendRequests = useTRPGSelector((state) => state.user.friendRequests);

  const friendListPane = useMemo(
    () => (
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
    ),
    [friendList]
  );

  const friendInviteListPane = useMemo(
    () => (
      <TabPane
        tab={
          <Badge count={friendInvite.length}>
            <span>好友邀请</span>
          </Badge>
        }
        key="2"
      >
        <PaneContainer>
          {friendInvite.map((userUUID) => (
            <UserListItem
              key={userUUID}
              userUUID={userUUID}
              actions={[
                <Tooltip title="取消" key="cancel">
                  <Button shape="circle" icon={<CloseOutlined />} />
                </Tooltip>,
              ]}
            />
          ))}
        </PaneContainer>
      </TabPane>
    ),
    [friendInvite]
  );

  const friendRequestsPane = useMemo(
    () => (
      <TabPane
        tab={
          <Badge count={friendRequests.length}>
            <span>好友请求</span>
          </Badge>
        }
        key="3"
      >
        <PaneContainer>
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
        </PaneContainer>
      </TabPane>
    ),
    [friendRequests]
  );

  const addFriendPane = useMemo(
    () => (
      <TabPane tab={<AddFriendTabLabel>添加好友</AddFriendTabLabel>} key="4">
        <PaneContainer>
          <Typography.Title level={4}>添加好友</Typography.Title>
          <AddFriend />
        </PaneContainer>
      </TabPane>
    ),
    []
  );

  return (
    <SectionTabs defaultActiveKey="1">
      {friendListPane}
      {friendInviteListPane}
      {friendRequestsPane}
      {addFriendPane}
    </SectionTabs>
  );
});
FriendPanel.displayName = 'FriendPanel';
