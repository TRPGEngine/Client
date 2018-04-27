const React = require('react');
const {
  Text,
} = require('react-native');
const sb = require('react-native-style-block');

class TIcon extends React.Component {
  static defaultProps = {
    style: [],
    icon: '',
  }

  render() {
    return (
      <Text
        {...this.props}
        style={styles.text}
      >{this.props.icon}</Text>
    )
  }
}

const styles = {
  text: {
    fontFamily:'iconfont',
    fontSize: 26,
  },
}

module.exports = TIcon;
