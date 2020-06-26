import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, ListRenderItem } from 'react-native';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGStackNavigation } from '@app/router';
import { UserItem } from './UserItem';

interface Props {
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
        name,
      });
    },
    [navigation]
  );

  const renderItem = useMemo(() => {
    return (
      props.renderItem ||
      (({ item }: ListRenderItemInfo<string>) => {
        return (
          <UserItem
            uuid={item}
            onPress={(uuid, name) => handlePress(uuid, name)}
          />
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

export default UserList;
