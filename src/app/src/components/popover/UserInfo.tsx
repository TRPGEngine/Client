import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import config from '@shared/project.config';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import _isEmpty from 'lodash/isEmpty';
import { TAvatar } from '../TComponent';
import {
  AttrRow,
  Container,
  AvatarContainer,
  AttrContainer,
} from './__shared__';

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
