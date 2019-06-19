import React from 'react';
import { Text, TextInput } from 'react-native';
import sb from 'react-native-style-block';

class TInput extends React.Component {
  static defaultProps = {
    style: [],
  };

  focus() {
    this.refs.input.focus();
  }

  blur() {
    this.refs.input.blur();
  }

  render() {
    return (
      <TextInput
        ref="input"
        underlineColorAndroid="transparent"
        autoCorrect={false}
        autoCapitalize="none"
        {...this.props}
        style={[...styles.input, ...this.props.style]}
      />
    );
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
};

export default TInput;
