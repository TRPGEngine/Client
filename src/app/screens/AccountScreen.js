const React = require('react');
const {
  View,
  Text,
} = require('react-native');

class AccountScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '我',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe60d;</Text>
    ),
  };

  render() {
    return (
      <View>
        <Text>account screen</Text>
      </View>
    )
  }
}

module.exports = AccountScreen;
