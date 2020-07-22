import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import { Avatar } from './Avatar';
import { getUserName } from '@shared/utils/data-helper';
import { MessageOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: row;
`;

const UserNameText = styled.div`
  flex: 1;
`;

interface Props {
  userUUID: string;
}
export const UserListItem: React.FC<Props> = TMemo((props) => {
  const userInfo = useCachedUserInfo(props.userUUID);
  const userName = getUserName(userInfo);

  return (
    <Root>
      <Avatar src={userInfo.avatar} name={userName} />
      <UserNameText>{userName}</UserNameText>
      <MessageOutlined />
    </Root>
  );
});
UserListItem.displayName = 'UserListItem';
