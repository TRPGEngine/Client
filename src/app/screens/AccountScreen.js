const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Alert,
} = require('react-native');
const { NavigationActions } = require('react-navigation');
const sb = require('react-native-style-block');
const { logout } = require('../../redux/actions/user');
const ListCell = require('../components/ListCell');
const { TButton } = require('../components/TComponent');

class AccountScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '我',
    headerTitle: '我',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe60d;</Text>
    ),
  };

  _handleLogout() {
    this.props.dispatch(logout());
  }

  render() {
    return (
      <View>
        <Text>account screen</Text>
        <Text>redux测试:{this.props.showLoadingText}</Text>
        <Text>平台信息获取:{require('../../../config/project.config').platform}</Text>
        <Text>{JSON.stringify(this.props)}</Text>
        <ListCell
          title="测试项"
          icon="&#xe648;"
          color="gold"
          onClick={() => {
            this.props.dispatch(NavigationActions.navigate({ routeName: 'Details' }));
          }}
        />
        <TButton
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
    sb.bgColor('#ff4400'),
    sb.border('all', 0),
    sb.radius(2),
    sb.margin(10),
  ]
}

module.exports = connect(
  state => ({
    showLoadingText: state.getIn(['ui', 'showLoadingText']),
  })
)(AccountScreen);
