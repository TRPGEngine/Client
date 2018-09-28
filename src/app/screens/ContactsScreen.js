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
const {
  TIcon,
} = require('../components/TComponent');
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
              <TIcon style={[...styles.icon, sb.bgColor('#16a085')]} icon="&#xe61d;" />
              <Text>寻找基友/姬友</Text>
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
    sb.margin(10, 0),
    sb.padding(0, 20),
  ],
  iconBtnView: [
    sb.direction(),
    sb.alignCenter(),
  ],
  icon: [
    {color: 'white', fontFamily: 'iconfont', fontSize: 20, textAlign: 'center', lineHeight: 40},
    sb.size(40, 40),
    sb.radius(3),
    sb.margin(0, 10, 0, 0),
  ],
  list: [
    sb.flex()
  ],
}

module.exports = connect()(ContactsScreen);
