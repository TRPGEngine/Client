import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import { Avatar } from './Avatar';
import { getUserName } from '@shared/utils/data-helper';
import styled from 'styled-components';
import _isNil from 'lodash/isNil';
import { Skeleton, Typography, Space } from 'antd';

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

  return (
    <Root>
      <Skeleton
        avatar={true}
        title={false}
        loading={_isNil(userInfo)}
        active={true}
      >
        <Avatar
          src={userInfo.avatar}
          name={userName}
          style={{ marginRight: 10 }}
        />
        <UserNameText>{userName}</UserNameText>
        <Space>{...actions}</Space>
      </Skeleton>
    </Root>
  );
});
UserListItem.displayName = 'UserListItem';
