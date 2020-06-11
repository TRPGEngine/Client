import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  FlatList,
  ListRenderItemInfo,
  ListRenderItem,
} from 'react-native';
import styled from 'styled-components/native';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import {
  getUserInfoCache,
  getCachedUserName,
} from '@shared/utils/cache-helper';
import TAvatar from './TComponent/TAvatar';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGStackNavigation } from '@app/router';

export const UserItem = styled.TouchableOpacity`
  padding: 10px 0;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 0.5px;
  border-bottom-color: ${(props) => props.theme.color.borderBase};
`;

export const UserAvatar = styled(TAvatar).attrs((props) => ({
  width: 40,
  height: 40,
}))`
  margin: 0 4px;
`;

interface Props extends TRPGDispatchProp {
  uuids: string[]; // 用户的uuid列表
  renderItem?: ListRenderItem<string>;
}

const UserList: React.FC<Props> = TMemo((props) => {
  const navigation = useTRPGStackNavigation();

  const handlePress = useCallback(
    (uuid: string, name: string) => {
      navigation.navigate('Profile', {
        uuid,
        type: 'user',
      });
    },
    [navigation]
  );

  const renderItem = useMemo(() => {
    return (
      props.renderItem ||
      (({ item }: ListRenderItemInfo<string>) => {
        const uuid = item;
        const user = getUserInfoCache(uuid);
        const name = getCachedUserName(uuid);

        return (
          <UserItem onPress={() => handlePress(uuid, name)}>
            <UserAvatar name={name} uri={user.avatar} />
            <Text>{name}</Text>
          </UserItem>
        );
      })
    );
  }, [props.renderItem, handlePress]);

  return (
    <FlatList
      data={props.uuids}
      keyExtractor={(uuid) => uuid}
      renderItem={renderItem}
    />
  );
});

export default connect((state: TRPGState) => ({
  usercache: state.cache.user,
}))(UserList);
