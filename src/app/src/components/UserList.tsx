import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  FlatList,
  ListRenderItemInfo,
  ListRenderItem,
} from 'react-native';
import styled from 'styled-components/native';
import { TRPGState } from '@redux/types/__all__';
import {
  getUserInfoCache,
  getCachedUserName,
} from '@shared/utils/cache-helper';
import TAvatar from './TComponent/TAvatar';

export const UserItem = styled.View`
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

interface Props {
  uuids: string[]; // 用户的uuid列表
  renderItem?: ListRenderItem<string>;
}

class UserList extends React.Component<Props> {
  renderItem = ({ item }: ListRenderItemInfo<string>) => {
    const uuid = item;
    const user = getUserInfoCache(uuid);
    const name = getCachedUserName(uuid);

    return (
      <UserItem>
        <UserAvatar name={name} uri={user.get('avatar')} />
        <Text>{name}</Text>
      </UserItem>
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.uuids}
        keyExtractor={(uuid) => uuid}
        renderItem={this.props.renderItem || this.renderItem}
      />
    );
  }
}

export default connect((state: TRPGState) => ({
  usercache: state.getIn(['cache', 'user']),
}))(UserList);
