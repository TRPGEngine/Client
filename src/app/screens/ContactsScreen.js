const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
} = require('react-native');

class ContactsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '通讯录',
    headerTitle: '通讯录',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe958;</Text>
    ),
  };

  render() {
    return (
      <View>
        <Text>contacts screen</Text>
      </View>
    )
  }
}

module.exports = connect()(ContactsScreen);
