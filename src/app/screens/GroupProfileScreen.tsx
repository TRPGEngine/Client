import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import sb from 'react-native-style-block';
import appConfig from '../config.app';
import { getSamlpeDate } from '../../shared/utils/dateHelper';
import { TButton, TAvatar, TImageViewer } from '../components/TComponent';
import { getGroupInfo } from '../../redux/actions/cache';
import { addFriend } from '../../redux/actions/user';
import { switchToConverseApp } from '../redux/actions/nav';
import { getUserInfoCache } from '../../shared/utils/cacheHelper';
import { List } from 'immutable';
import { NavigationScreenProps } from 'react-navigation';

interface ItemProps {
  name: string;
  value: string;
}
class ProfileInfoItem extends React.Component<ItemProps> {
  render() {
    return (
      <View style={styles.item}>
        <Text style={{ width: 80 }}>{this.props.name}:</Text>
        <Text>{this.props.value}</Text>
      </View>
    );
  }
}

interface Props
  extends DispatchProp<any>,
    NavigationScreenProps<{ uuid: string }> {
  addedGroupUUIDList: List<string>;
  groupcache: any;
}
class ProfileScreen extends React.Component<Props> {
  componentDidMount() {
    let uuid = this.props.navigation.state.params.uuid;
    if (uuid) {
      // 获取最新团信息
      this.props.dispatch(getGroupInfo(uuid, undefined));
    }
  }

  render() {
    const groupUUID = this.props.navigation.state.params.uuid;
    const hasJoined = this.props.addedGroupUUIDList.includes(groupUUID);
    const groupInfo = this.props.groupcache.get(groupUUID);

    if (!groupInfo) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    let avatar = groupInfo.get('avatar')
      ? groupInfo.get('avatar')
      : appConfig.defaultImg.user;
    let name = groupInfo.get('name');

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TImageViewer images={[avatar.replace('/thumbnail', '')]}>
            <TAvatar
              style={styles.avatar}
              uri={avatar}
              name={groupInfo.get('name')}
              capitalSize={40}
              height={100}
              width={100}
            />
          </TImageViewer>
          <Text style={{ fontSize: 18, marginTop: 4 }}>
            {groupInfo.get('name')}
          </Text>
          <Text style={{ fontSize: 12, color: '#999' }}>
            {groupInfo.get('sub_name')}
          </Text>
        </View>
        <View style={{ paddingLeft: 10, backgroundColor: 'white' }}>
          <ProfileInfoItem name="唯一标识" value={groupInfo.get('uuid')} />
          <ProfileInfoItem name="团副名" value={groupInfo.get('username')} />
        </View>
        <View style={styles.actions}>
          {hasJoined ? (
            <TButton>发送消息</TButton>
          ) : (
            <TButton>申请加入</TButton>
          )}
        </View>
      </View>
    );
  }
}

const styles = {
  container: [{ flex: 1 }],
  header: [
    { marginBottom: 10 },
    sb.alignCenter(),
    sb.bgColor('white'),
    sb.padding(20, 0),
  ],
  avatar: [sb.radius(50)],
  item: [
    { flexDirection: 'row' },
    sb.padding(10, 4),
    sb.border('Bottom', 0.5, '#eee'),
  ],
  actions: [sb.padding(10)],
};

export default connect((state: any) => ({
  addedGroupUUIDList: state
    .getIn(['group', 'groups'])
    .map((g) => g.get('uuid')),
  groupcache: state.getIn(['cache', 'group']),
}))(ProfileScreen);
