import React, { useMemo } from 'react';
import { FlatList, ListRenderItemInfo, ListRenderItem } from 'react-native';
import { TMemo } from '@shared/components/TMemo';
import { UserItem } from './UserItem';

interface Props {
  uuids: string[]; // 用户的uuid列表
  renderItem?: ListRenderItem<string>;
}

const UserList: React.FC<Props> = TMemo((props) => {
  const renderItem = useMemo(() => {
    return (
      props.renderItem ||
      (({ item }: ListRenderItemInfo<string>) => {
        return <UserItem uuid={item} />;
      })
    );
  }, [props.renderItem]);

  return (
    <FlatList
      data={props.uuids}
      keyExtractor={(uuid) => uuid}
      renderItem={renderItem}
    />
  );
});
UserList.displayName = 'UserList';

export default UserList;
