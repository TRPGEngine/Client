import React from 'react';
import { View, Text, TextInputProps, StyleProp } from 'react-native';
import sb from 'react-native-style-block';
import TInput, { TInputProps } from './TInput';

interface Props {
  label: string;
  value: string;
  style: StyleProp<View>;
  input: TInputProps;
  onChangeText: (text: string) => void;
}

class TFormGroup extends React.Component<Props> {
  static defaultProps = {
    label: '',
    value: '',
    onChangeText: () => {},
    style: [],
    input: [],
  };

  render() {
    if (this.props.input && !this.props.input.style) {
      this.props.input.style = [];
    }
    return (
      <View {...this.props} style={[...styles.container, ...this.props.style]}>
        <Text style={styles.label}>{this.props.label}:</Text>
        <TInput
          value={this.props.value}
          onChangeText={(text: string) => this.props.onChangeText(text)}
          {...this.props.input}
          style={[...styles.input, ...this.props.input.style]}
        />
      </View>
    );
  }
}

const styles = {
  container: [
    sb.direction('row'),
    sb.alignCenter(),
    // sb.flex(),
    sb.border('Bottom', 0.5, '#ccc'),
    { marginBottom: 10, height: 44 },
  ],
  label: [
    sb.margin(0, 10, 0, 0),
    sb.flex(1),
    sb.textAlign('right'),
    sb.font(16),
    { minWidth: 80, height: 32, lineHeight: 32 },
  ],
  input: [
    sb.flex(3),
    sb.border('all', 0),
    sb.bgColor('transparent'),
    sb.font(16),
  ],
};

export default TFormGroup;
