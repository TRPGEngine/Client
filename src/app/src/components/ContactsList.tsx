import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  SectionListData,
} from 'react-native';
import sb from 'react-native-style-block';
import appConfig from '../config.app';
import { TIcon } from './TComponent';
import ConvItem from './ConvItem';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import _get from 'lodash/get';
import { useTRPGTabNavigation, TRPGTabScreenProps } from '@app/router';
import { TRPGTabNavigation } from '@app/types/navigation';

interface SectionListItemData {
  uuid: string;
  avatar: string;
  name: string;
  type: string;
}

interface SectionListItem extends SectionListData<SectionListItemData> {
  name: '好友' | '团';
  isShow: boolean;
}

interface Props extends TRPGDispatchProp {
  navigation: TRPGTabNavigation<'Contacts'>;
  friends: any;
  groups: any;
}
interface State {
  showFriends: boolean;
  showGroups: boolean;
}
class ContactList extends React.Component<Props, State> {
  state = {
    showFriends: true,
    showGroups: true,
  };

  get friends() {
    return this.props.friends;
  }

  get groups() {
    return this.props.groups;
  }

  handleClickHeader(section: SectionListItem) {
    const { name, isShow } = section;
    if (name === '好友') {
      this.setState({ showFriends: !isShow });
    } else if (name === '团') {
      this.setState({ showGroups: !isShow });
    }
  }

  handleShowProfile(uuid: string, type: string, name: string) {
    if (type === 'user') {
      this.props.navigation.dangerouslyGetParent().navigate('Profile', {
        uuid,
        type,
      });
    } else if (type === 'group') {
      this.props.navigation.dangerouslyGetParent().navigate('GroupProfile', {
        uuid,
        type,
        name,
      });
    }
  }

  getHeader(section) {
    return (
      <TouchableOpacity
        style={styles.header}
        onPress={() => this.handleClickHeader(section)}
      >
        {section.isShow ? (
          <TIcon icon="&#xe60f;" style={styles.headerIcon} />
        ) : (
          <TIcon icon="&#xe60e;" style={styles.headerIcon} />
        )}
        <Text>{section.name}</Text>
      </TouchableOpacity>
    );
  }

  getCell(item) {
    let defaultAvatar = appConfig.defaultImg.user;

    return (
      <ConvItem
        icon={item.avatar || defaultAvatar}
        title={item.name}
        content={''}
        uuid={item.uuid}
        style={styles.cell}
        onPress={() => {
          this.handleShowProfile(item.uuid, item.type, item.name);
        }}
      />
    );
  }

  getList(): ReadonlyArray<SectionListItem> {
    const { showFriends, showGroups } = this.state;

    return [
      {
        name: '好友',
        data: showFriends ? this.friends : [],
        isShow: showFriends,
      },
      {
        name: '团',
        data: showGroups ? this.groups : [],
        isShow: showGroups,
      },
    ];
  }

  render() {
    if (this.props.friends.length === 0 && this.props.groups.length === 0) {
      return (
        <View>
          <Text>暂无联系人, 快去交♂朋♂友吧</Text>
        </View>
      );
    }
    return (
      <SectionList
        renderSectionHeader={({ section }) => this.getHeader(section)}
        renderItem={({ item }) => this.getCell(item)}
        scrollEnabled={true}
        sections={this.getList()}
        keyExtractor={(item, index) => item.uuid + index}
        style={styles.listContainer}
      />
    );
  }
}

const styles = {
  listContainer: [sb.bgColor()],
  header: [
    sb.direction(),
    sb.alignCenter(),
    sb.padding(10),
    sb.border('Bottom', 0.5, '#eeeeee'),
    sb.bgColor(),
  ],
  headerIcon: [{ fontSize: 12, marginRight: 4 }],
  cell: [{ marginLeft: 20, paddingLeft: 10 }],
};

export default connect((state: TRPGState) => {
  const usercache = state.cache.user;
  const friends = state.user.friendList;
  const groups = state.group.groups;

  return {
    friends: friends.map((f) => ({
      uuid: _get(usercache, [f, 'uuid']),
      avatar: _get(usercache, [f, 'avatar']),
      name:
        _get(usercache, [f, 'nickname']) ?? _get(usercache, [f, 'username']),
      type: 'user',
    })),
    groups: groups.map((g) => ({
      uuid: g.uuid,
      avatar: g.avatar,
      name: g.name,
      type: 'group',
    })),
  };
})((props) => {
  const navigation = useTRPGTabNavigation();

  return <ContactList {...props} navigation={navigation} />;
});
