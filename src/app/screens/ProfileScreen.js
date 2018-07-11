const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Image,
  TouchableOpacity,
} = require('react-native');
const sb = require('react-native-style-block');
const appConfig = require('../config.app');
const { getSamlpeDate } = require('../../utils/dateHelper');
const { TButton } = require('../components/TComponent');
const { getUserInfo } = require('../../redux/actions/cache');
const { addFriend } = require('../../redux/actions/user');
const { getUserInfoCache } = require('../../utils/cacheHelper');

class ProfileInfoItem extends React.Component {
  render() {
    return (
      <View style={styles.item}>
        <Text style={{width: 80}}>{this.props.name}:</Text>
        <Text>{this.props.value}</Text>
      </View>
    )
  }
}

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let uuid = this.props.navigation.state.params.uuid;
    if(uuid) {
      console.log('获取最新用户信息', uuid);
      this.props.dispatch(getUserInfo(uuid));
    }

  }

  _handlePressAvatar(avatar) {
    console.log(avatar);
    if(avatar.uri) {
      let media = [
        {
          photo: avatar.uri.replace('/thumbnail', '')
        },
      ]
      this.props.navigation.navigate('PhotoBrowser', {media, index:0});
    }
  }

  render() {
    let userUUID = this.props.navigation.state.params.uuid;
    let userInfo = getUserInfoCache(userUUID);
    let hasFriend = this.props.friendList.includes(userUUID);

    if(!userInfo) {
      return (
        <View><Text>无内容</Text></View>
      )
    }

    let avatar = userInfo.get('avatar') ? {uri: userInfo.get('avatar')} : appConfig.defaultImg.user;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this._handlePressAvatar(avatar)}>
            <Image style={styles.avatar} source={avatar} />
          </TouchableOpacity>
          <Text style={{fontSize: 18, marginTop: 4}}>{userInfo.get('nickname') || userInfo.get('username')}</Text>
          <Text style={{fontSize: 12, color: '#999'}}>{userInfo.get('uuid')}</Text>
        </View>
        <View style={{paddingLeft: 10, backgroundColor: 'white'}}>
          <ProfileInfoItem name="用户名" value={userInfo.get('username')} />
          <ProfileInfoItem name="性别" value={userInfo.get('sex')} />
          <ProfileInfoItem name="简介" value={userInfo.get('desc') || '这个人很懒什么都没有留下'} />
          <ProfileInfoItem name="上次登录" value={getSamlpeDate(userInfo.get('last_login')) || '无记录'} />
          <ProfileInfoItem name="注册时间" value={getSamlpeDate(userInfo.get('createAt'))} />
        </View>
        <View style={styles.actions}>
          {
            hasFriend ? (
              <TButton>
                发送消息
              </TButton>
            ) : (
              <TButton onPress={() => this.props.dispatch(addFriend(userUUID))}>
                加为好友
              </TButton>
            )
          }
        </View>
      </View>
    )
  }
}

const styles = {
  container: [
    {flex: 1},
  ],
  header: [
    {marginBottom: 10},
    sb.alignCenter(),
    sb.bgColor('white'),
    sb.padding(20, 0),
  ],
  avatar: [
    sb.size(100, 100),
    sb.radius(50),
  ],
  item: [
    {flexDirection: 'row'},
    sb.padding(10, 4),
    sb.border('Bottom', 0.5, '#eee'),
  ],
  actions: [
    sb.padding(10),
  ],
}

module.exports = connect(
  state => ({
    usercache: state.getIn(['cache', 'user']),
    friendList: state.getIn(['user', 'friendList']),
  })
)(ProfileScreen);
