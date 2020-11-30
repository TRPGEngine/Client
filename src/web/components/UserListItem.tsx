import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import { Avatar } from './Avatar';
import { getUserName } from '@shared/utils/data-helper';
import styled from 'styled-components';
import _isNil from 'lodash/isNil';
import { Skeleton, Typography, Space } from 'antd';
import { isUUID } from '@shared/utils/uuid';
import { openUserProfile } from './modals/UserProfile';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 44px;
  border-radius: ${(props) => props.theme.radius.standard};
  padding: 0 10px;

  &:hover {
    background-color: ${(props) => props.theme.color.transparent90};
  }
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer !important;
  margin-right: 10px;
`;

const UserNameText = styled(Typography)`
  flex: 1;
  color: ${(props) => props.theme.color.headerPrimary} !important;
`;

interface Props {
  userUUID: string;
  actions?: React.ReactElement[];
}
export const UserListItem: React.FC<Props> = TMemo((props) => {
  const { actions = [] } = props;
  const userInfo = useCachedUserInfo(props.userUUID);
  const userName = getUserName(userInfo);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isUUID(userInfo.uuid)) {
        e.stopPropagation();
        openUserProfile(userInfo.uuid);
      }
    },
    [userInfo.uuid]
  );

  return (
    <Root>
      <Skeleton
        loading={_isNil(userInfo)}
        avatar={true}
        title={false}
        active={true}
      >
        <div onClick={handleClick}>
          <UserAvatar src={userInfo.avatar} name={userName} />
        </div>
        <UserNameText>{userName}</UserNameText>
        <Space>{...actions}</Space>
      </Skeleton>
    </Root>
  );
});
UserListItem.displayName = 'UserListItem';
