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
const { TButton, TAvatar } = require('../components/TComponent');
const { getUserInfo } = require('../../redux/actions/cache');
const { addFriend } = require('../../redux/actions/user');
const { switchToConverseApp } = require('../../redux/actions/nav');
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
      // TODO: 获取最新团信息
    }
  }

  _handlePressAvatar(avatar) {
    if(avatar) {
      let media = [
        {
          photo: avatar.replace('/thumbnail', '')
        },
      ]
      this.props.navigation.navigate('PhotoBrowser', {media, index:0});
    }
  }

  render() {
    let groupUUID = this.props.navigation.state.params.uuid;
    let hasJoined = this.props.addedGroupUUIDList.includes(groupUUID);
    let groupInfo = {get:(a) => a}; // TODO: 等待实现团信息缓存

    if(!groupInfo) {
      return (
        <View><Text>无内容</Text></View>
      )
    }

    let avatar = groupInfo.get('avatar') ? groupInfo.get('avatar') : appConfig.defaultImg.user;
    let name = groupInfo.get('name');

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this._handlePressAvatar(avatar)}>
            <TAvatar style={styles.avatar} uri={avatar} name={groupInfo.get('name')} capitalSize={40} height={100} width={100} />
          </TouchableOpacity>
          <Text style={{fontSize: 18, marginTop: 4}}>{groupInfo.get('name')}</Text>
          <Text style={{fontSize: 12, color: '#999'}}>{groupInfo.get('sub_name')}</Text>
        </View>
        <View style={{paddingLeft: 10, backgroundColor: 'white'}}>
          <ProfileInfoItem name="唯一标识" value={groupInfo.get('uuid')} />
          <ProfileInfoItem name="团副名" value={groupInfo.get('username')} />
        </View>
        <View style={styles.actions}>
          {
            hasJoined ? (
              <TButton>
                发送消息
              </TButton>
            ) : (
              <TButton>
                申请加入
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
    addedGroupUUIDList: state.getIn(['group', 'groups']).map(g => g.get('uuid')),
  })
)(ProfileScreen);
