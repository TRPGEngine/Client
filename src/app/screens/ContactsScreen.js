const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  ListView,
  TouchableOpacity,
} = require('react-native');
const sb = require('react-native-style-block');
const { NavigationActions } = require('react-navigation');
const ContactsList = require('../components/ContactsList');

class ContactsScreen extends React.Component {
  static navigationOptions = {
    // tabBarLabel: '通讯录',
    title: '通讯录',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe958;</Text>
    ),
  };

  _handlePressAddFriend() {
    this.props.dispatch(NavigationActions.navigate({routeName: 'AddFriend'}))
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => this._handlePressAddFriend()}>
            <View style={styles.iconBtnView}>
              <Text style={[...styles.icon, sb.bgColor('#16a085')]}>&#xe604;</Text>
              <Text>添加好友</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => alert('添加团')}>
            <View style={styles.iconBtnView}>
              <Text style={[...styles.icon, sb.bgColor('#d35400')]}>&#xe61c;</Text>
              <Text>添加团</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          <ContactsList />
        </View>
      </View>
    )

  }
}

const styles = {
  container: [
    sb.flex(),
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
  ],
  list: [
    sb.flex()
  ],
}

module.exports = connect()(ContactsScreen);
