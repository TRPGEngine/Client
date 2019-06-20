import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import sb from 'react-native-style-block';
import immutable from 'immutable';
import appConfig from '../config.app';
import { getSamlpeDate } from '../../shared/utils/dateHelper';
import { TButton, TAvatar, TImageViewer } from '../components/TComponent';
import { getUserInfo } from '../../redux/actions/cache';
import { addFriend } from '../../redux/actions/user';
import { switchToConverseApp } from '../redux/actions/nav';
import { getUserInfoCache } from '../../shared/utils/cacheHelper';

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

interface NavigationParams {
  uuid: string;
  type: 'user' | 'group';
}
interface ScreenProps
  extends DispatchProp,
    NavigationScreenProps<NavigationParams> {
  friendList: immutable.List<string>;
}
class ProfileScreen extends React.Component<ScreenProps> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let uuid = this.props.navigation.state.params.uuid;
    if (uuid) {
      console.log('获取最新用户信息', uuid);
      this.props.dispatch(getUserInfo(uuid));
    }
  }

  _handlePressSendMsg() {
    let type = this.props.navigation.state.params.type;
    let userUUID = this.props.navigation.state.params.uuid;
    let userInfo = getUserInfoCache(userUUID);
    this.props.dispatch(
      switchToConverseApp(
        userUUID,
        type,
        userInfo.get('nickname') || userInfo.get('username')
      )
    );
  }

  render() {
    let userUUID = this.props.navigation.state.params.uuid;
    let userInfo = getUserInfoCache(userUUID);
    let hasFriend = this.props.friendList.includes(userUUID);

    if (!userInfo) {
      return (
        <View>
          <Text>无内容</Text>
        </View>
      );
    }

    let avatar = userInfo.get('avatar')
      ? userInfo.get('avatar')
      : appConfig.defaultImg.user;
    let name = userInfo.get('nickname') || userInfo.get('username');

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TImageViewer images={[avatar.replace('/thumbnail', '')]}>
            <TAvatar
              style={styles.avatar}
              uri={avatar}
              name={name}
              capitalSize={40}
              height={100}
              width={100}
            />
          </TImageViewer>
          <Text style={{ fontSize: 18, marginTop: 4 }}>{name}</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>
            {userInfo.get('uuid')}
          </Text>
        </View>
        <View style={{ paddingLeft: 10, backgroundColor: 'white' }}>
          <ProfileInfoItem name="用户名" value={userInfo.get('username')} />
          <ProfileInfoItem name="性别" value={userInfo.get('sex')} />
          <ProfileInfoItem
            name="简介"
            value={userInfo.get('desc') || '这个人很懒什么都没有留下'}
          />
          <ProfileInfoItem
            name="上次登录"
            value={getSamlpeDate(userInfo.get('last_login')) || '无记录'}
          />
          <ProfileInfoItem
            name="注册时间"
            value={getSamlpeDate(userInfo.get('createAt'))}
          />
        </View>
        <View style={styles.actions}>
          {hasFriend ? (
            <TButton onPress={() => this._handlePressSendMsg()}>
              发送消息
            </TButton>
          ) : (
            <TButton onPress={() => this.props.dispatch(addFriend(userUUID))}>
              加为好友
            </TButton>
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
  usercache: state.getIn(['cache', 'user']),
  friendList: state.getIn(['user', 'friendList']),
}))(ProfileScreen);
