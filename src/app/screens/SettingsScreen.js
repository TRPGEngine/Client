const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
} = require('react-native');

class SettingsScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>设置</Text>
      </View>
    )
  }
}

module.exports = connect()(SettingsScreen);
