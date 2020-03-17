import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import config from '@shared/project.config';
import { useCachedUserInfo } from '@shared/hooks/cache';
import _isEmpty from 'lodash/isEmpty';
import { TAvatar } from '../TComponent';
import styled from 'styled-components/native';

const Container = styled.View`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const AvatarContainer = styled.View`
  width: 40px;
  height: 40px;
  margin: 6px;
`;

const AttrContainer = styled.View`
  flex: 1;
`;

const AttrRow = styled.View`
  display: flex;
  flex-direction: row;
  max-width: 180px;
  margin-bottom: 4px;
`;

interface Props {
  userUUID: string;
}
const PopoverUserInfo: React.FC<Props> = React.memo((props) => {
  const userInfo = useCachedUserInfo(props.userUUID);

  const name = useMemo(() => userInfo.nickname ?? userInfo.username ?? '', [
    userInfo.nickname,
    userInfo.username,
  ]);

  const avatar = useMemo(
    () =>
      _isEmpty(userInfo.avatar)
        ? config.defaultImg.getUser(name)
        : userInfo.avatar,
    [userInfo.avatar]
  );

  return (
    <Container>
      <AvatarContainer>
        <TAvatar uri={avatar} name={name} height={40} width={40} />
      </AvatarContainer>
      <AttrContainer>
        <AttrRow>
          <Text>用户名: </Text>
          <Text>{name}</Text>
        </AttrRow>
        <AttrRow>
          <Text>性别: </Text>
          <Text>{userInfo.sex}</Text>
        </AttrRow>
        <AttrRow>
          <Text>签名: </Text>
          <Text>{userInfo.sign}</Text>
        </AttrRow>
      </AttrContainer>
    </Container>
  );
});
PopoverUserInfo.displayName = 'PopoverUserInfo';

export default PopoverUserInfo;
