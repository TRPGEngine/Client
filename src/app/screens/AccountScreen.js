const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} = require('react-native');
const { NavigationActions } = require('react-navigation');
const sb = require('react-native-style-block');
const config = require('../../../config/project.config');
const appConfig = require('../config.app');
const { logout } = require('../../redux/actions/user');
const { openWebview } = require('../../redux/actions/nav');
const ListCell = require('../components/ListCell');
const { TButton, TAvatar } = require('../components/TComponent');
const checkVersion = require('../../utils/checkVersion');
const appUtils = require('../../utils/apputils');

class AccountScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '我',
    headerTitle: '我',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe60d;</Text>
    ),
  };

  _handleModifyProfile() {
    this.props.dispatch(NavigationActions.navigate({routeName: 'ProfileModify'}));
  }

  _handleLogout() {
    this.props.dispatch(logout());
  }

  render() {
    const userInfo = this.props.userInfo;
    let avatar = userInfo.get('avatar') || appConfig.defaultImg.user;
    let name = userInfo.get('nickname') || userInfo.get('username');
    return (
      <View>
        <TouchableOpacity style={styles.userInfo} onPress={() => this._handleModifyProfile()}>
          <TAvatar uri={avatar} style={styles.avatar} name={name} height={60} width={60} />
          <View style={{flex: 1}}>
            <Text style={styles.username}>{name}</Text>
            <Text style={styles.userdesc}>{userInfo.get('sign')}</Text>
          </View>
          <Text style={styles.arrow}>&#xe60e;</Text>
        </TouchableOpacity>

        <View style={styles.listView}>
          <ListCell
            title="发现"
            icon="&#xe60b;"
            color="cornflowerblue"
            onPress={() => {
              this.props.dispatch(openWebview(config.url.goddessfantasy));
            }}
          />
          <ListCell
            title="设置"
            icon="&#xe609;"
            color="gold"
            onPress={() => {
              this.props.dispatch(NavigationActions.navigate({ routeName: 'Settings' }));
            }}
          />
        </View>
        <View style={styles.listView}>
          <ListCell
            title="当前版本"
            value={config.version}
            onPress={() => {
              checkVersion(function(isLatest) {
                if(isLatest) {
                  appUtils.toast('当前版本为最新版');
                }else {
                  appUtils.toast('检测到有新的版本, 1秒后自动跳转到项目主页');
                  setTimeout(function() {
                    Linking.openURL(config.github.projectUrl);
                  }, 1000);
                }
              })
            }}
          />
        </View>

        <TButton
          type="error"
          style={styles.logoutBtn}
          textStyle={{color: 'white'}}
          onPress={() => this._handleLogout()}
        >退出</TButton>
      </View>
    )
  }
}

const styles = {
  logoutBtn: [
    sb.margin(10),
  ],
  userInfo: [
    sb.direction(),
    sb.bgColor(),
    sb.border('Top', 0.5, '#ccc'),
    sb.border('Bottom', 0.5, '#ccc'),
    sb.margin(14, 0),
    sb.padding(4, 8),
    sb.alignCenter(),
    {height: 80},
  ],
  avatar: [
    sb.radius(30),
    {marginRight: 10},
  ],
  username: [
    sb.font(18),
  ],
  userdesc: [
    sb.color('#999'),
  ],
  arrow: [
    {fontFamily: 'iconfont', marginRight: 6},
    sb.font(18),
    sb.color('#ccc'),
  ],
  listView: [
    {marginBottom: 10}
  ],
}

module.exports = connect(
  state => ({
    userInfo: state.getIn(['user', 'info']),
  })
)(AccountScreen);
