const React = require('react');
const {
  Text,
  TextInput,
} = require('react-native');
const sb = require('react-native-style-block');

class TInput extends React.Component {
  static defaultProps = {
    style: [],
  }

  render() {
    return (
      <TextInput
        underlineColorAndroid="transparent"
        {...this.props}
        style={[...styles.input, ...this.props.style]}
      />
    )
  }
}

const styles = {
  input: [
    {
      height: 32,
      minWidth: 200,
    },
    sb.bgColor(),
    sb.radius(3),
    sb.border('all', 1, '#ccc'),
    sb.padding(4, 6),
  ],
}

module.exports = TInput;
