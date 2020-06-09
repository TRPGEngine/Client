import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import sb from 'react-native-style-block';
import appConfig from '@app/config.app';
import { TButton, TAvatar, TImageViewer } from '@app/components/TComponent';
import { getGroupInfo } from '@shared/redux/actions/cache';
import { getGroupInfoCache } from '@shared/utils/cache-helper';
import { requestJoinGroup } from '@src/shared/redux/actions/group';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import { TRPGStackScreenProps } from '@app/router';
import { switchToChatScreen } from '@app/navigate';

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

interface Props extends TRPGDispatchProp, TRPGStackScreenProps<'GroupProfile'> {
  addedGroupUUIDList: string[];
  groupcache: any;
}
class ProfileScreen extends React.Component<Props> {
  componentDidMount() {
    let uuid = this.props.route.params?.uuid;
    if (uuid) {
      // 获取最新团信息
      this.props.dispatch(getGroupInfo(uuid, undefined));
    }
  }

  // 处理发送信息事件
  handlePressSendMsg = () => {
    const groupUUID = this.props.route.params?.uuid;
    const groupInfo = getGroupInfoCache(groupUUID);
    switchToChatScreen(
      this.props.navigation,
      groupUUID,
      'group',
      groupInfo.name
    );
  };

  // 处理发送入团申请事件
  handleJoinGroup = () => {
    const groupUUID = this.props.route.params?.uuid;
    this.props.dispatch(requestJoinGroup(groupUUID));
    this.props.navigation.goBack();
  };

  render() {
    const groupUUID = this.props.route.params?.uuid;
    const hasJoined = this.props.addedGroupUUIDList.includes(groupUUID);
    const groupInfo = this.props.groupcache[groupUUID];

    if (!groupInfo) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    const avatar = groupInfo.avatar ?? appConfig.defaultImg.user;
    const name = groupInfo.name;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TImageViewer images={[avatar.replace('/thumbnail', '')]}>
            <TAvatar
              uri={avatar}
              name={name}
              capitalSize={40}
              height={100}
              width={100}
            />
          </TImageViewer>
          <Text style={{ fontSize: 18, marginTop: 4 }}>{name}</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>
            {groupInfo.sub_name}
          </Text>
        </View>
        <View style={{ paddingLeft: 10, backgroundColor: 'white' }}>
          <ProfileInfoItem name="唯一标识" value={groupInfo.uuid} />
          <ProfileInfoItem name="团副名" value={groupInfo.username} />
        </View>
        <View style={styles.actions}>
          {hasJoined ? (
            <TButton onPress={this.handlePressSendMsg}>发送消息</TButton>
          ) : (
            <TButton onPress={this.handleJoinGroup}>申请加入</TButton>
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
  item: [
    { flexDirection: 'row' },
    sb.padding(10, 4),
    sb.border('Bottom', 0.5, '#eee'),
  ],
  actions: [sb.padding(10)],
};

export default connect((state: TRPGState) => ({
  addedGroupUUIDList: state.group.groups.map((g) => g.uuid),
  groupcache: state.cache.group,
}))(ProfileScreen);
