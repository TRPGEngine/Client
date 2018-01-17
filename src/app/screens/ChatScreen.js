const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
} = require('react-native');

class ChatScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>chat screen</Text>
      </View>
    )
  }
}

module.exports = connect()(ChatScreen);
