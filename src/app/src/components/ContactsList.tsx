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
import { switchNav } from '../redux/actions/nav';
import { isImmutable } from 'immutable';

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

interface Props extends DispatchProp<any> {
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
    const friends = this.props.friends;
    if (isImmutable(friends)) {
      return friends.toJS();
    } else {
      return friends;
    }
  }

  get groups() {
    const groups = this.props.groups;
    if (isImmutable(groups)) {
      return groups.toJS();
    } else {
      return groups;
    }
  }

  handleClickHeader(section: SectionListItem) {
    const { name, isShow } = section;
    if (name === '好友') {
      this.setState({ showFriends: !isShow });
    } else if (name === '团') {
      this.setState({ showGroups: !isShow });
    }
  }

  handleShowProfile(uuid, type, name) {
    if (type === 'user') {
      this.props.dispatch(
        switchNav('Profile', {
          uuid,
          type,
          name,
        })
      );
    } else if (type === 'group') {
      this.props.dispatch(
        switchNav('GroupProfile', {
          uuid,
          type,
          name,
        })
      );
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
    if (this.props.friends.size === 0 && this.props.groups.size === 0) {
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
        keyExtractor={(item, index) => item + index}
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

export default connect((state: any) => {
  let usercache = state.getIn(['cache', 'user']);
  let friends = state.getIn(['user', 'friendList']);
  let groups = state.getIn(['group', 'groups']);

  return {
    friends: friends.map((f) => ({
      uuid: usercache.getIn([f, 'uuid']),
      avatar: usercache.getIn([f, 'avatar']),
      name:
        usercache.getIn([f, 'nickname']) || usercache.getIn([f, 'username']),
      type: 'user',
    })),
    groups: groups.map((g) => ({
      uuid: g.get('uuid'),
      avatar: g.get('avatar'),
      name: g.get('name'),
      type: 'group',
    })),
  };
})(ContactList);
