import React from 'react';
import { Text, TextInput, TextInputProps } from 'react-native';
import sb from 'react-native-style-block';

export type TInputProps = TextInputProps & { style?: any };

class TInput extends React.Component<TInputProps> {
  static defaultProps = {
    style: [],
  };

  focus() {
    (this.refs.input as TextInput).focus();
  }

  blur() {
    (this.refs.input as TextInput).blur();
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
