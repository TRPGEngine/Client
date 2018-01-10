const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
} = require('react-native');

class HomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'TRPG',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe648;</Text>
    ),
  };

  render() {
    return (
      <View>
        <Text>home screen</Text>
        <Text>redux测试:{this.props.showLoadingText}</Text>
        <Text>平台信息获取:{require('../../../config/project.config').platform}</Text>
      </View>
    )
  }
}

module.exports = connect(
  state => ({
    showLoadingText: state.getIn(['ui', 'showLoadingText']),
  })
)(HomeScreen);
