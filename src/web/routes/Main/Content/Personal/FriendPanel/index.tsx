import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { Tabs, Badge, Tooltip as AntdTooltip, Button, Typography } from 'antd';
import { UserListItem } from '@web/components/UserListItem';
import { PillTabs } from '@web/components/PillTabs';
import styled from 'styled-components';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { AddFriend } from './AddFriend';
import { t } from '@shared/i18n';
import { useHistory } from 'react-router';
import { addUserConverse } from '@redux/actions/chat';
import {
  requestRemoveFriendInvite,
  agreeFriendInvite,
  refuseFriendInvite,
} from '@redux/actions/user';
const { TabPane } = Tabs;

const PaneContainer = styled.div`
  padding: 10px 20px;
`;

const AddFriendTabLabel = styled.div`
  color: ${(props) => props.theme.color.downy};
`;

const Tooltip = styled(AntdTooltip).attrs({
  overlayStyle: { pointerEvents: 'none' },
  mouseEnterDelay: 0.5,
})``;

export const FriendPanel: React.FC = TMemo(() => {
  const friendList = useTRPGSelector((state) => state.user.friendList);
  const friendInvite = useTRPGSelector((state) => state.user.friendInvite);
  const friendRequests = useTRPGSelector((state) => state.user.friendRequests);
  const history = useHistory();
  const dispatch = useTRPGDispatch();

  const handleNavMsg = (userUUID: string) => {
    dispatch(addUserConverse([userUUID]));
    history.push(`/main/personal/converse/${userUUID}`);
  };

  // 取消好友邀请
  const handleCancelFriendInvite = (inviteUUID: string) => {
    dispatch(
      requestRemoveFriendInvite({
        inviteUUID,
      })
    );
  };

  const handleAgreeFriendInvite = (inviteUUID: string) => {
    dispatch(agreeFriendInvite(inviteUUID));
  };

  const handleRefuseFriendInvite = (inviteUUID: string) => {
    dispatch(refuseFriendInvite(inviteUUID));
  };

  const friendListPane = useMemo(
    () => (
      <TabPane tab={t('全部')} key="1">
        <PaneContainer>
          {friendList.map((uuid) => (
            <UserListItem
              key={uuid}
              userUUID={uuid}
              actions={[
                <Tooltip title={t('发送消息')} key="sendMsg">
                  <Button
                    shape="circle"
                    icon={<MessageOutlined />}
                    onClick={() => handleNavMsg(uuid)}
                  />
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
            <span>{t('已发送')}</span>
          </Badge>
        }
        key="2"
      >
        <PaneContainer>
          {friendInvite.map((inv) => (
            <UserListItem
              key={inv.to_uuid}
              userUUID={inv.to_uuid}
              actions={[
                <Tooltip title={t('取消')} key="cancel">
                  <Button
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => handleCancelFriendInvite(inv.uuid)}
                  />
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
            <span>{t('好友请求')}</span>
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
                  <Button
                    key="refuse"
                    danger={true}
                    type="primary"
                    onClick={() => handleRefuseFriendInvite(request.uuid)}
                  >
                    {t('拒绝')}
                  </Button>,
                  <Button
                    key="agree"
                    type="primary"
                    onClick={() => handleAgreeFriendInvite(request.uuid)}
                  >
                    {t('同意')}
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
      <TabPane
        tab={<AddFriendTabLabel>{t('添加好友')}</AddFriendTabLabel>}
        key="4"
      >
        <PaneContainer>
          <Typography.Title level={4}>{t('添加好友')}</Typography.Title>
          <AddFriend />
        </PaneContainer>
      </TabPane>
    ),
    []
  );

  return (
    <PillTabs defaultActiveKey="1">
      {friendListPane}
      {friendInviteListPane}
      {friendRequestsPane}
      {addFriendPane}
    </PillTabs>
  );
});
FriendPanel.displayName = 'FriendPanel';
