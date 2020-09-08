import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import Avatar from '../Avatar';
import { getUserName } from '@shared/utils/data-helper';
import { Button, Tabs, Divider, Space } from 'antd';
import { useTranslation } from '@shared/i18n';
import { FullModalField } from '../FullModalField';
import { getShortDate } from '@shared/utils/date-helper';
import { openModal } from '../Modal';
import styled from 'styled-components';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';

const Root = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
`;

const InfoAvatar = styled(Avatar).attrs({
  size: 64,
})`
  margin-right: 10px;
`;

const InfoText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 22px;
`;

const InfoTextSub = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.color['silver']};
`;

function useShowFriendRequest(userUUID: string): boolean {
  const currentUserInfo = useCurrentUserInfo();
  const friendList = useTRPGSelector((state) => state.user.friendList);

  if (currentUserInfo.uuid === userUUID) {
    return false;
  }

  return !friendList.includes(userUUID);
}

/**
 * 用户详情信息
 */
interface UserProfileProps {
  userUUID: string;
}
export const UserProfile: React.FC<UserProfileProps> = TMemo((props) => {
  const { userUUID } = props;

  const userInfo = useCachedUserInfo(userUUID, { forceFetch: true });
  const { t } = useTranslation();

  const showFriendRequest = useShowFriendRequest(userUUID);

  return (
    <Root>
      <Info>
        <InfoAvatar src={userInfo.avatar} name={userInfo.name} />
        <InfoText>
          <div>{getUserName(userInfo)}</div>
          <InfoTextSub>{userInfo.username}</InfoTextSub>
        </InfoText>
        <Space>
          {/* actions */}
          {showFriendRequest && <Button>{t('发送好友申请')}</Button>}
          <Button>{t('发送消息')}</Button>
        </Space>
      </Info>
      <Divider style={{ margin: 0 }} />
      <div>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane key="1" tab={t('用户信息')}>
            <FullModalField title={t('性别')} value={userInfo.sex} />
            <FullModalField title={t('简介')} value={userInfo.sign} />
            <FullModalField
              title={t('最后登录')}
              value={getShortDate(userInfo.last_login)}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Root>
  );
});
UserProfile.displayName = 'UserProfile';

/**
 * 打开一个用户信息的模态框
 * @param userUUID 用户UUID
 */
export function openUserProfile(userUUID: string) {
  openModal(<UserProfile userUUID={userUUID} />);
}
