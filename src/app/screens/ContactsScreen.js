const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  ListView,
  TouchableOpacity,
} = require('react-native');
const sb = require('react-native-style-block');
const appConfig = require('../config.app');
const ConvItem = require('../components/ConvItem');

class ContactsScreen extends React.Component {
  static navigationOptions = {
    // tabBarLabel: '通讯录',
    title: '通讯录',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe958;</Text>
    ),
  };

  _handleShowProfile(uuid, type, name) {
    this.props.navigation.navigate('Profile', {
      uuid,
      type,
      name,
    })
  }

  getContactsList() {
    let friends = this.props.friends;
    let usercache = this.props.usercache;

    if(friends.size > 0) {
      let defaultAvatar = appConfig.defaultImg.user;

      let arr = this.props.friends
        .map(uuid => {
          let name = usercache.getIn([uuid, 'nickname']) || usercache.getIn([uuid, 'username']);
          return {
            icon: usercache.getIn([uuid, 'avatar']) || defaultAvatar,
            title: name,
            content: usercache.getIn([uuid, 'sign']),
            uuid,
            onPress: () => {
              this._handleShowProfile(uuid, 'user', name)
            },
          }
        })
        .toJS();

      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      let items = ds.cloneWithRows(arr);

      return (
        <ListView
          style={styles.contactsList}
          dataSource={items}
          renderRow={(rowData) => (
            <ConvItem
              {...rowData}
            />
          )}
        />
      )
    }else {
      return (
        <View><Text>暂无会话信息</Text></View>
      )
    }
  }

  render() {

    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => alert('添加好友')}>
            <View style={styles.iconBtnView}>
              <Text style={[...styles.icon, sb.bgColor('#16a085')]}>&#xe604;</Text>
              <Text>添加好友</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => alert('添加团')}>
            <View style={styles.iconBtnView}>
              <Text style={[...styles.icon, sb.bgColor('#d35400')]}>&#xe604;</Text>
              <Text>添加团</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          {this.getContactsList()}
        </View>
      </View>
    )

  }
}

const styles = {
  contactsList: [
    sb.bgColor(),
  ],
  header: [
    sb.direction(),
    // sb.padding(10, 0),
    sb.bgColor(),
    {marginBottom: 10},
  ],
  iconBtn: [
    sb.flex(),
    sb.alignCenter(),
    sb.margin(10, 0),
  ],
  iconBtnView: [
    sb.alignCenter(),
  ],
  icon: [
    {color: 'white', fontFamily: 'iconfont', fontSize: 20, textAlign: 'center', lineHeight: 40},
    sb.size(40, 40),
    sb.radius(20),
  ]
}

module.exports = connect(
  state => ({
    friends: state.getIn(['user', 'friendList']),
    usercache: state.getIn(['cache', 'user']),
  })
)(ContactsScreen);
