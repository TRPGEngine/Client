import React from 'react';
import { connect } from 'react-redux';
import { View, Text, ScrollView } from 'react-native';
import sb from 'react-native-style-block';
import appConfig from '../config.app';
import { getSimpleDate } from '@shared/utils/date-helper';
import { TButton, TAvatar, TImageViewer } from '../components/TComponent';
import { getUserInfo } from '@shared/redux/actions/cache';
import { sendFriendInvite } from '@shared/redux/actions/user';
import { getUserInfoCache } from '@shared/utils/cache-helper';
import { addUserConverse } from '@src/shared/redux/actions/chat';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import { TRPGStackScreenProps } from '@app/router';
import { switchToChatScreen } from '@app/navigate';
import { getUserName } from '@shared/utils/data-helper';

interface ItemProps {
  name: string;
  value: string;
}
/** 信息列表组件 */
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

interface ScreenProps
  extends TRPGDispatchProp,
    TRPGStackScreenProps<'Profile'> {
  friendList: string[];
  selfUUID: string;
}
/**
 * 用户信息页面
 */
class ProfileScreen extends React.Component<ScreenProps> {
  get userUUID(): string {
    return this.props.route.params?.uuid ?? '';
  }

  get isSelf() {
    return this.props.selfUUID === this.userUUID;
  }

  componentDidMount() {
    const uuid = this.props.route.params?.uuid;
    if (uuid) {
      console.log('获取最新用户信息', uuid);
      this.props.dispatch(getUserInfo(uuid));
    }
  }

  handlePressSendMsg = () => {
    let type = this.props.route.params?.type;
    let userUUID = this.props.route.params?.uuid;
    let userInfo = getUserInfoCache(userUUID);

    // 创建用户会话并切换到该会话
    this.props.dispatch(addUserConverse([userUUID]));
    switchToChatScreen(
      this.props.navigation,
      userUUID,
      type,
      getUserName(userInfo)
    );
  };

  render() {
    const userUUID = this.userUUID;
    const userInfo = getUserInfoCache(userUUID);
    const isFriend = this.props.friendList.includes(userUUID);

    if (!userInfo) {
      return (
        <View>
          <Text>无内容</Text>
        </View>
      );
    }

    let avatar = userInfo.avatar ? userInfo.avatar : appConfig.defaultImg.user;
    let name = userInfo.nickname || userInfo.username;

    return (
      <ScrollView style={styles.container}>
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
          <Text style={{ fontSize: 12, color: '#999' }}>{userInfo.uuid}</Text>
        </View>
        <View style={{ paddingLeft: 10, backgroundColor: 'white' }}>
          <ProfileInfoItem name="用户名" value={userInfo.username} />
          <ProfileInfoItem name="性别" value={userInfo.sex} />
          <ProfileInfoItem
            name="简介"
            value={userInfo.sign || '这个人很懒什么都没有留下'}
          />
          <ProfileInfoItem
            name="上次登录"
            value={getSimpleDate(userInfo.last_login) || '无记录'}
          />
          <ProfileInfoItem
            name="注册时间"
            value={getSimpleDate(userInfo.createAt)}
          />
        </View>
        {!this.isSelf ? (
          <View style={styles.actions}>
            {isFriend ? (
              <TButton onPress={this.handlePressSendMsg}>发送消息</TButton>
            ) : (
              <TButton
                onPress={() => this.props.dispatch(sendFriendInvite(userUUID))}
              >
                加为好友
              </TButton>
            )}
          </View>
        ) : null}
      </ScrollView>
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
  usercache: state.cache.user,
  friendList: state.user.friendList,
  selfUUID: state.user.info.uuid,
}))(ProfileScreen);
